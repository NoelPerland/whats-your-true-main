import Phaser from 'phaser';

import { OVERWORLD_NPC_VISUAL_CONFIG } from '../assets/ninjaAdventureAssetCatalog';
import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import { GameSessionStore, gameSessionStore } from '../core/state/GameSessionStore';
import type { GameSession } from '../data/types/GameSession';
import type { OverworldMapDefinition } from '../data/types/Overworld';
import type { BattleSceneData, OverworldSceneData } from '../data/types/SceneData';
import { ensureOverworldGuideNpcIdleAnimation } from '../systems/animation/OverworldNpcAnimationRegistry';
import { BattleContentLoader } from '../systems/content/BattleContentLoader';
import { ContentLoader } from '../systems/content/ContentLoader';
import { OverworldContentLoader } from '../systems/content/OverworldContentLoader';
import { buildStarterOverworldMap } from '../systems/overworld/OverworldMapBuilder';
import {
  getMovedPosition,
  isInsideRect,
  isWithinDistance,
  readMovementDirection,
  type OverworldBoundsLimits,
} from '../systems/overworld/OverworldRuntimeHelpers';
import { OverworldInputController } from '../systems/overworld/OverworldInputController';
import { createOverworldPlayerVisual, type OverworldPlayerVisual } from '../systems/overworld/OverworldPlayerVisual';
import {
  createOverworldAmbientEffects,
  type OverworldAmbientEffectsHandle,
} from '../systems/overworld/OverworldAmbientEffects';
import {
  createOverworldDecorations,
  type OverworldDecorationHandle,
} from '../systems/overworld/OverworldDecorationHelper';
import { SimpleDialoguePanel } from '../ui/dialogue/SimpleDialoguePanel';
import { OverworldHud } from '../ui/overworld/OverworldHud';
import { ASSET_KEYS } from '../core/constants/assetKeys';

const PLAYER_SPEED = 220;

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class OverworldScene extends Phaser.Scene {
  private sessionStore!: GameSessionStore;
  private session!: GameSession;
  private mapDefinition!: OverworldMapDefinition;

  private player!: OverworldPlayerVisual;
  private npc!: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;
  private npcNameText!: Phaser.GameObjects.Text;
  private playerCollisionHalfExtents = { halfWidth: 13, halfHeight: 17 };
  private characterLayerDepth = 30;

  private hud!: OverworldHud;
  private dialoguePanel!: SimpleDialoguePanel;
  private inputController!: OverworldInputController;
  private ambientEffects?: OverworldAmbientEffectsHandle;
  private decorations?: OverworldDecorationHandle;

  private nearNpc = false;
  private insideEncounterZone = false;

  constructor() {
    super(SCENE_KEYS.OVERWORLD);
  }

  create(data: OverworldSceneData = {}): void {
    this.cameras.main.setBackgroundColor('#1e4130');

    this.sessionStore = this.resolveSessionStore();
    this.session = this.resolveSession(data);
    this.mapDefinition = OverworldContentLoader.getStarterMap();

    this.buildWorldVisuals();
    this.createUi();

    this.dialoguePanel = new SimpleDialoguePanel(this);
    this.setupInput();
    this.refreshHudText();
    if (data.battleSummary) {
      this.hud.setNotice(data.battleSummary);
      this.time.delayedCall(3600, () => {
        this.hud.setNotice('');
      });
    }
    this.refreshInteractionPrompt();
    this.refreshEncounterZonePrompt();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputController.destroy();
      this.hud.destroy();
      this.dialoguePanel.destroy();
      this.ambientEffects?.destroy();
      this.decorations?.destroy();
      this.player.destroy();
      this.npc.destroy();
      this.npcNameText.destroy();
    });
  }

  override update(_time: number, delta: number): void {
    this.updatePlayerMovement(delta);
    this.updateCharacterDepths();
    this.refreshInteractionPrompt();
    this.refreshEncounterZonePrompt();
  }

  private resolveSessionStore(): GameSessionStore {
    const service = this.registry.get('sessionStore');
    if (service instanceof GameSessionStore) {
      return service;
    }

    this.registry.set('sessionStore', gameSessionStore);
    return gameSessionStore;
  }

  private resolveSession(data: OverworldSceneData): GameSession {
    if (data.restoredSession) {
      const restored = cloneValue(data.restoredSession);
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

  private buildWorldVisuals(): void {
    const mapRender = buildStarterOverworldMap(this, this.mapDefinition);
    this.characterLayerDepth = mapRender.characterLayerDepth;
    this.ambientEffects = createOverworldAmbientEffects(this, {
      anchors: mapRender.ambientAnchors,
      depthBase: mapRender.propsLayerDepth,
    });
    this.decorations = createOverworldDecorations(this, this.mapDefinition, mapRender.propsLayerDepth);

    const { spawnPoint } = this.mapDefinition;
    this.player = createOverworldPlayerVisual(this, { x: spawnPoint.x, y: spawnPoint.y });
    this.playerCollisionHalfExtents = this.player.getCollisionHalfExtents();

    this.npc = this.createNpcVisual(this.mapDefinition.npc.x, this.mapDefinition.npc.y);
    this.npcNameText = this.add
      .text(this.npc.x, this.npc.y - 30, this.mapDefinition.npc.name, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#fff4cc',
      })
      .setOrigin(0.5, 1);
  }

  private createNpcVisual(x: number, y: number): Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle {
    const animationKey = ensureOverworldGuideNpcIdleAnimation(this);
    if (animationKey && this.textures.exists(ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET)) {
      const npcSprite = this.add
        .sprite(x, y, ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET, 0)
        .setScale(OVERWORLD_NPC_VISUAL_CONFIG.scale)
        .setOrigin(0.5, 0.5);

      npcSprite.play(animationKey, true);
      return npcSprite;
    }

    return this.add.rectangle(x, y, 24, 30, 0xeecb84, 1).setStrokeStyle(2, 0x3a2a14, 1);
  }

  private createUi(): void {
    this.hud = new OverworldHud(this, {
      npcPosition: { x: this.npc.x, y: this.npc.y },
    });
  }

  private setupInput(): void {
    this.inputController = new OverworldInputController(this, {
      onExit: this.handleExitToTitle,
      onInteract: this.handleInteractKey,
      onBattle: this.handleBattleTrigger,
    });

    this.inputController.initialize();
  }

  private readonly handleExitToTitle = (): void => {
    SceneNavigator.start(this, SCENE_KEYS.TITLE);
  };

  private readonly handleInteractKey = (): void => {
    if (this.dialoguePanel.isOpen()) {
      this.dialoguePanel.hide();
      return;
    }

    if (!this.nearNpc) {
      if (this.insideEncounterZone) {
        this.handleBattleTrigger();
      }
      return;
    }

    this.dialoguePanel.show({
      speaker: this.mapDefinition.npc.name,
      lines: this.mapDefinition.npc.dialogueLines.slice(0, 2),
    });
  };

  private readonly handleBattleTrigger = (): void => {
    if (!this.insideEncounterZone) {
      this.hud.setNotice('Explore the eastern wild route before starting a skirmish.');
      return;
    }

    const encounter = BattleContentLoader.getRandomEarlyEncounter();
    const latestSession = this.sessionStore.getSession() ?? this.session;
    const sceneData: BattleSceneData = {
      session: latestSession,
      encounter,
      returnToMapId: this.session.mapState.mapId,
    };

    SceneNavigator.start(this, SCENE_KEYS.BATTLE, sceneData);
  };

  private updatePlayerMovement(delta: number): void {
    if (this.dialoguePanel.isOpen()) {
      this.player.setMovementDirection({ x: 0, y: 0 });
      return;
    }

    const inputState = this.inputController.getAxisInputState();
    if (!inputState) {
      this.player.setMovementDirection({ x: 0, y: 0 });
      return;
    }

    const direction = readMovementDirection(inputState);
    const bounds = this.getPlayerBoundsLimits();
    const playerPosition = this.player.getPosition();

    const moved = getMovedPosition(playerPosition, direction, PLAYER_SPEED, delta, bounds);

    this.player.setPosition(moved.x, moved.y);
    this.player.setMovementDirection(direction);
  }

  private updateCharacterDepths(): void {
    const playerPosition = this.player.getPosition();
    this.player.setRenderDepth(this.characterLayerDepth + playerPosition.y * 0.01);
    this.npc.setDepth(this.characterLayerDepth + this.npc.y * 0.01);
    this.npcNameText.setDepth(this.npc.depth + 0.5);
  }

  private getPlayerBoundsLimits(): OverworldBoundsLimits {
    const { bounds } = this.mapDefinition;
    return {
      minX: bounds.x + this.playerCollisionHalfExtents.halfWidth,
      maxX: bounds.x + bounds.width - this.playerCollisionHalfExtents.halfWidth,
      minY: bounds.y + this.playerCollisionHalfExtents.halfHeight,
      maxY: bounds.y + bounds.height - this.playerCollisionHalfExtents.halfHeight,
    };
  }

  private refreshHudText(): void {
    const playerName = this.session.playerProfile?.name ?? 'Unknown Hero';
    const playerClass = this.session.playerProfile?.classId ?? 'unassigned';
    this.hud.setPlayerSummary(playerName, playerClass, this.session.mapState.mapId);
  }

  private refreshInteractionPrompt(): void {
    const playerPosition = this.player.getPosition();

    this.nearNpc = isWithinDistance(
      playerPosition,
      { x: this.npc.x, y: this.npc.y },
      this.mapDefinition.npc.interactionRadius,
    );

    const shouldShow = this.nearNpc && !this.dialoguePanel.isOpen();
    this.hud.setInteractionPromptVisible(shouldShow, 'Press Enter or Space to talk');
  }

  private refreshEncounterZonePrompt(): void {
    const encounterZone = this.mapDefinition.encounterZone;
    if (!encounterZone) {
      this.insideEncounterZone = false;
      this.hud.setEncounterPromptVisible(false, '');
      return;
    }

    const playerPosition = this.player.getPosition();
    this.insideEncounterZone = isInsideRect(playerPosition, {
      x: encounterZone.x,
      y: encounterZone.y,
      width: encounterZone.width,
      height: encounterZone.height,
    });

    this.hud.setEncounterPromptVisible(this.insideEncounterZone, 'Wild route: Enter/Space or B to skirmish');
  }
}


