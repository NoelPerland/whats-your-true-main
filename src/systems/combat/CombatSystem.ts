import type {
  BattleAction,
  BattleActionType,
  BattleActorState,
  BattleEvent,
  BattleOutcome,
  BattleResult,
  BattleStateSnapshot,
  CombatSetup,
  TurnEntry,
} from '../../data/types/Battle';

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class CombatSystem {
  private actors: BattleActorState[];
  private turnQueue: string[] = [];
  private turnNumber = 1;
  private outcome: BattleOutcome = 'ongoing';

  constructor(setup: CombatSetup) {
    this.actors = [cloneValue(setup.playerActor), cloneValue(setup.enemyActor)];
    this.turnQueue = this.buildTurnQueue();
    this.prepareCurrentTurn();
  }

  getCurrentTurn(): TurnEntry | null {
    if (this.outcome !== 'ongoing') {
      return null;
    }

    const actor = this.getCurrentActor();
    if (!actor) {
      return null;
    }

    return {
      turnNumber: this.turnNumber,
      actorId: actor.id,
      actorName: actor.name,
      actorTeam: actor.team,
    };
  }

  getStateSnapshot(): BattleStateSnapshot {
    return {
      actors: this.actors.map((actor) => cloneValue(actor)),
      currentTurn: this.getCurrentTurn(),
      outcome: this.outcome,
    };
  }

  getAvailablePlayerActions(): BattleActionType[] {
    const current = this.getCurrentActor();
    if (!current || current.team !== 'player' || this.outcome !== 'ongoing') {
      return [];
    }

    return ['attack', 'defend'];
  }

  executePlayerAction(actionType: BattleActionType): BattleResult {
    const current = this.getCurrentActor();
    if (!current || current.team !== 'player') {
      return this.buildResult([
        {
          type: 'info',
          message: 'Player cannot act right now.',
        },
      ]);
    }

    const action: BattleAction = {
      actorId: current.id,
      type: actionType,
    };

    return this.resolveAction(action);
  }

  executeEnemyTurn(): BattleResult {
    const current = this.getCurrentActor();
    if (!current || current.team !== 'enemy') {
      return this.buildResult([
        {
          type: 'info',
          message: 'Enemy cannot act right now.',
        },
      ]);
    }

    const action: BattleAction = {
      actorId: current.id,
      type: 'attack',
      targetId: this.getFirstAliveActor('player')?.id,
    };

    return this.resolveAction(action);
  }

  private resolveAction(action: BattleAction): BattleResult {
    if (this.outcome !== 'ongoing') {
      return this.buildResult([
        {
          type: 'info',
          message: 'Battle is already finished.',
        },
      ]);
    }

    const actor = this.getActorById(action.actorId);
    if (!actor || actor.hp <= 0) {
      return this.buildResult([
        {
          type: 'info',
          message: 'Acting combatant is unavailable.',
        },
      ]);
    }

    const events: BattleEvent[] = [];

    if (action.type === 'defend') {
      actor.isDefending = true;
      events.push({
        type: 'defend',
        actorId: actor.id,
        message: `${actor.name} braces for incoming damage.`,
      });
    } else {
      const target = action.targetId ? this.getActorById(action.targetId) : this.getDefaultTarget(actor.team);
      if (!target || target.hp <= 0) {
        events.push({
          type: 'info',
          actorId: actor.id,
          message: `${actor.name} has no valid target.`,
        });
      } else {
        const damage = this.calculateDamage(actor, target);
        target.hp = Math.max(0, target.hp - damage);

        events.push({
          type: 'damage',
          actorId: actor.id,
          targetId: target.id,
          amount: damage,
          message: `${actor.name} attacks ${target.name} for ${damage} damage.`,
        });

        if (target.hp <= 0) {
          events.push({
            type: 'defeat',
            actorId: target.id,
            message: `${target.name} is defeated!`,
          });
        }
      }
    }

    this.advanceTurn();
    return this.buildResult(events);
  }

  private calculateDamage(attacker: BattleActorState, target: BattleActorState): number {
    const mitigatedDefense = Math.floor(target.defense * 0.5);
    let damage = Math.max(1, attacker.attack - mitigatedDefense);

    if (target.isDefending) {
      damage = Math.max(1, Math.floor(damage * 0.5));
    }

    return damage;
  }

  private advanceTurn(): void {
    this.updateOutcome();
    if (this.outcome !== 'ongoing') {
      this.turnQueue = [];
      return;
    }

    this.turnQueue.shift();

    if (this.turnQueue.length === 0) {
      this.turnQueue = this.buildTurnQueue();
    }

    if (this.turnQueue.length > 0) {
      this.turnNumber += 1;
      this.prepareCurrentTurn();
    }
  }

  private updateOutcome(): void {
    const playerAlive = this.getFirstAliveActor('player') !== undefined;
    const enemyAlive = this.getFirstAliveActor('enemy') !== undefined;

    if (playerAlive && enemyAlive) {
      this.outcome = 'ongoing';
      return;
    }

    this.outcome = playerAlive ? 'victory' : 'defeat';
  }

  private prepareCurrentTurn(): void {
    const current = this.getCurrentActor();
    if (!current) {
      return;
    }

    current.isDefending = false;
  }

  private buildTurnQueue(): string[] {
    return this.actors
      .filter((actor) => actor.hp > 0)
      .sort((left, right) => {
        if (left.speed !== right.speed) {
          return right.speed - left.speed;
        }

        if (left.team === right.team) {
          return left.name.localeCompare(right.name);
        }

        return left.team === 'player' ? -1 : 1;
      })
      .map((actor) => actor.id);
  }

  private getCurrentActor(): BattleActorState | undefined {
    const actorId = this.turnQueue[0];
    if (!actorId) {
      return undefined;
    }

    return this.getActorById(actorId);
  }

  private getActorById(actorId: string): BattleActorState | undefined {
    return this.actors.find((actor) => actor.id === actorId);
  }

  private getFirstAliveActor(team: BattleActorState['team']): BattleActorState | undefined {
    return this.actors.find((actor) => actor.team === team && actor.hp > 0);
  }

  private getDefaultTarget(actorTeam: BattleActorState['team']): BattleActorState | undefined {
    return actorTeam === 'player' ? this.getFirstAliveActor('enemy') : this.getFirstAliveActor('player');
  }

  private buildResult(events: BattleEvent[]): BattleResult {
    const summary = events.map((event) => event.message).join(' ');

    return {
      state: this.getStateSnapshot(),
      events,
      summary,
    };
  }
}
