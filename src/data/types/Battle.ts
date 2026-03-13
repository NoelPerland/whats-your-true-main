export type BattleTeam = 'player' | 'enemy';
export type BattleActionType = 'attack' | 'defend';
export type BattleOutcome = 'ongoing' | 'victory' | 'defeat';

export interface BattleEnemyDefinition {
  id: string;
  name: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface BattleEncounterDefinition {
  encounterId: string;
  name: string;
  introText: string;
  rewardText: string;
  enemy: BattleEnemyDefinition;
}

export interface BattleActorState {
  id: string;
  name: string;
  team: BattleTeam;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  isDefending: boolean;
}

export interface BattleAction {
  actorId: string;
  type: BattleActionType;
  targetId?: string;
}

export interface TurnEntry {
  turnNumber: number;
  actorId: string;
  actorName: string;
  actorTeam: BattleTeam;
}

export interface BattleEvent {
  type: 'info' | 'damage' | 'defend' | 'defeat';
  message: string;
  actorId?: string;
  targetId?: string;
  amount?: number;
}

export interface BattleStateSnapshot {
  actors: BattleActorState[];
  currentTurn: TurnEntry | null;
  outcome: BattleOutcome;
}

export interface BattleResult {
  state: BattleStateSnapshot;
  events: BattleEvent[];
  summary: string;
}

export interface CombatSetup {
  playerActor: BattleActorState;
  enemyActor: BattleActorState;
}
