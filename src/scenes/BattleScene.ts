import Phaser from 'phaser';

import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import { GameSessionStore, gameSessionStore } from '../core/state/GameSessionStore';
import type {
  BattleActionType,
  BattleEncounterDefinition,
  BattleOutcome,
  BattleResult,
  BattleStateSnapshot,
} from '../data/types/Battle';
import type { GameSession } from '../data/types/GameSession';
import type { BattleSceneData, OverworldSceneData } from '../data/types/SceneData';
import { CombatFactory } from '../systems/combat/CombatFactory';
import { CombatSystem } from '../systems/combat/CombatSystem';
import { BATTLE_PLAYER_SPRITE, resolveBattleEnemySprite } from '../systems/battle/BattleVisualCatalog';
import { formatBattleEventsForLog, playBattleFeedback } from '../systems/battle/BattleFeedbackHelper';
import { BattleContentLoader } from '../systems/content/BattleContentLoader';
import { ContentLoader } from '../systems/content/ContentLoader';
import { BattleActorVisual } from '../ui/battle/BattleActorVisual';
import { BattleCommandMenu } from '../ui/battle/BattleCommandMenu';
import { BattleHud } from '../ui/battle/BattleHud';

const PLAYER_VISUAL_X = 230;
const ENEMY_VISUAL_X = 730;
const ACTOR_VISUAL_Y = 248;

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class BattleScene extends Phaser.Scene {
  private sessionStore!: GameSessionStore;
  private session!: GameSession;
  private encounter!: BattleEncounterDefinition;

  private combatSystem!: CombatSystem;

  private hud!: BattleHud;
  private commandMenu!: BattleCommandMenu;

  private playerVisual!: BattleActorVisual;
  private enemyVisual!: BattleActorVisual;

  private playerActorId = '';
  private enemyActorId = '';

  private isResolvingEnemyTurn = false;

  constructor() {
    super(SCENE_KEYS.BATTLE);
  }

  create(data: BattleSceneData = { encounter: BattleContentLoader.getStarterEncounter() }): void {
    this.sessionStore = this.resolveSessionStore();
    this.session = this.resolveSession(data);
    this.encounter = data.encounter ?? BattleContentLoader.getStarterEncounter();

    const setup = CombatFactory.createSetup(this.session, this.encounter);
    this.playerActorId = setup.playerActor.id;
    this.enemyActorId = setup.enemyActor.id;

    this.combatSystem = new CombatSystem(setup);

    this.createBattlefieldVisuals(setup.playerActor.name, setup.enemyActor.name);

    this.hud = new BattleHud(this);
    this.commandMenu = new BattleCommandMenu(this, {
      x: this.scale.width / 2,
      y: this.scale.height - 56,
      onCommandSelected: (command) => this.handlePlayerCommand(command),
    });

    this.syncUiFromCombatState(this.combatSystem.getStateSnapshot());
    this.hud.setLogText(this.encounter.introText);

    this.time.delayedCall(450, () => {
      this.beginTurnFlow();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.commandMenu.destroy();
      this.hud.destroy();
      this.playerVisual.destroy();
      this.enemyVisual.destroy();
    });
  }

  private resolveSessionStore(): GameSessionStore {
    const service = this.registry.get('sessionStore');
    if (service instanceof GameSessionStore) {
      return service;
    }

    this.registry.set('sessionStore', gameSessionStore);
    return gameSessionStore;
  }

  private resolveSession(data: BattleSceneData): GameSession {
    if (data.session) {
      const restored = cloneValue(data.session);
      this.sessionStore.setSession(restored);
      return restored;
    }

    const existing = this.sessionStore.getSession();
    if (existing) {
      return existing;
    }

    const fallback = ContentLoader.getDefaultSessionTemplate();
    this.sessionStore.setSession(fallback);
    return fallback;
  }

  private createBattlefieldVisuals(playerName: string, enemyName: string): void {
    // Gradient + floor + vignette keeps the focus centered on combatants.
    const background = this.add.graphics();
    background.fillGradientStyle(0x2f2448, 0x2f2448, 0x161f35, 0x161f35, 1);
    background.fillRect(0, 0, this.scale.width, this.scale.height);
    background.fillStyle(0x243149, 0.54);
    background.fillRect(0, 250, this.scale.width, 180);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.28);
    vignette.fillRect(0, 0, this.scale.width, 74);
    vignette.fillRect(0, this.scale.height - 148, this.scale.width, 148);
    vignette.fillRect(0, 0, 54, this.scale.height);
    vignette.fillRect(this.scale.width - 54, 0, 54, this.scale.height);

    this.add
      .text(this.scale.width / 2, 50, this.encounter.name, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '40px',
        color: '#f6e2ff',
        stroke: '#130f1f',
        strokeThickness: 8,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(20);

    this.playerVisual = new BattleActorVisual(this, {
      x: PLAYER_VISUAL_X,
      y: ACTOR_VISUAL_Y,
      kind: 'player',
      label: playerName,
      spriteConfig: BATTLE_PLAYER_SPRITE,
    });

    this.enemyVisual = new BattleActorVisual(this, {
      x: ENEMY_VISUAL_X,
      y: ACTOR_VISUAL_Y,
      kind: 'enemy',
      label: enemyName,
      spriteConfig: resolveBattleEnemySprite(this.encounter.enemy.id),
    });
  }

  private handlePlayerCommand(actionType: BattleActionType): void {
    if (this.isResolvingEnemyTurn) {
      return;
    }

    const result = this.combatSystem.executePlayerAction(actionType);
    this.applyBattleResult(result);
  }

  private beginTurnFlow(): void {
    const turn = this.combatSystem.getCurrentTurn();
    if (!turn) {
      return;
    }

    this.hud.setTurnText(`Turn ${turn.turnNumber} - ${turn.actorName}`);

    if (turn.actorTeam === 'player') {
      this.commandMenu.setEnabled(true);
      this.hud.setLogText('Choose your command.');
      return;
    }

    this.commandMenu.setEnabled(false);
    this.isResolvingEnemyTurn = true;

    this.time.delayedCall(500, () => {
      const enemyResult = this.combatSystem.executeEnemyTurn();
      this.isResolvingEnemyTurn = false;
      this.applyBattleResult(enemyResult);
    });
  }

  private applyBattleResult(result: BattleResult): void {
    playBattleFeedback(this, result.events, {
      playerActorId: this.playerActorId,
      enemyActorId: this.enemyActorId,
      playerVisual: this.playerVisual,
      enemyVisual: this.enemyVisual,
    });

    this.syncUiFromCombatState(result.state);

    const eventSummary = formatBattleEventsForLog(result.events);
    if (eventSummary) {
      this.hud.setLogText(eventSummary);
    } else if (result.summary.length > 0) {
      this.hud.setLogText(result.summary);
    }

    if (result.state.outcome !== 'ongoing') {
      this.handleBattleEnd(result.state.outcome, result.summary);
      return;
    }

    this.time.delayedCall(560, () => {
      this.beginTurnFlow();
    });
  }

  private syncUiFromCombatState(state: BattleStateSnapshot): void {
    const playerActor = state.actors.find((actor) => actor.team === 'player');
    const enemyActor = state.actors.find((actor) => actor.team === 'enemy');

    if (!playerActor || !enemyActor) {
      return;
    }

    this.hud.setCombatants(playerActor, enemyActor);
    this.playerVisual.setAliveState(playerActor.hp > 0);
    this.enemyVisual.setAliveState(enemyActor.hp > 0);
  }

  private handleBattleEnd(outcome: BattleOutcome, summary: string): void {
    this.commandMenu.setEnabled(false);

    if (outcome === 'victory') {
      const summaryText = summary.length > 0 ? `${summary} ${this.encounter.rewardText}` : this.encounter.rewardText;
      this.hud.setTurnText('Victory!');
      this.hud.setLogText(summaryText);

      this.session.updatedAt = new Date().toISOString();
      this.sessionStore.setSession(this.session);

      const sceneData: OverworldSceneData = {
        restoredSession: this.session,
        battleSummary: summaryText,
      };

      this.time.delayedCall(1000, () => {
        SceneNavigator.start(this, SCENE_KEYS.OVERWORLD, sceneData);
      });
      return;
    }

    this.hud.setTurnText('Defeat');
    this.hud.setLogText('Your party was defeated. Returning to title...');

    this.time.delayedCall(900, () => {
      SceneNavigator.start(this, SCENE_KEYS.TITLE);
    });
  }
}
