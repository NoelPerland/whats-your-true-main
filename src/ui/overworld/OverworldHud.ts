import Phaser from 'phaser';
import { ASSET_KEYS } from '../../core/constants/assetKeys';

export interface OverworldHudConfig {
  npcPosition: { x: number; y: number };
}

export class OverworldHud {
  private readonly frameTop: Phaser.GameObjects.Image;
  private readonly frameBottom: Phaser.GameObjects.Rectangle;
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly controlsText: Phaser.GameObjects.Text;
  private readonly noticeText: Phaser.GameObjects.Text;
  private readonly interactionPromptText: Phaser.GameObjects.Text;
  private readonly encounterPromptText: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene, config: OverworldHudConfig) {
    this.frameTop = scene.add
      .image(scene.scale.width / 2, 24, ASSET_KEYS.UI_PANEL)
      .setDisplaySize(scene.scale.width - 20, 52)
      .setTint(0x1a3556)
      .setAlpha(0.8)
      .setDepth(100);

    this.frameBottom = scene.add
      .rectangle(scene.scale.width / 2, scene.scale.height - 14, scene.scale.width - 40, 28, 0x0f1a30, 0.72)
      .setStrokeStyle(1, 0x44618e, 0.68)
      .setDepth(100);

    this.statusText = scene.add
      .text(16, 14, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#f1f6ff',
      })
      .setOrigin(0, 0)
      .setDepth(101);

    this.noticeText = scene.add
      .text(scene.scale.width / 2, 52, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#ffe29b',
        align: 'center',
      })
      .setOrigin(0.5, 0)
      .setDepth(101);

    this.controlsText = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 14, 'Move: Arrow Keys / WASD  |  Interact: Enter/Space  |  B: Skirmish  |  Esc: Title', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#dce8ff',
        align: 'center',
      })
      .setOrigin(0.5, 1)
      .setDepth(101);

    this.interactionPromptText = scene.add
      .text(config.npcPosition.x, config.npcPosition.y - 30, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#fef1b6',
      })
      .setOrigin(0.5, 1)
      .setDepth(101)
      .setVisible(false);

    this.encounterPromptText = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 36, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#ffd1a8',
      })
      .setOrigin(0.5, 1)
      .setDepth(101)
      .setVisible(false);
  }

  setPlayerSummary(playerName: string, classId: string, mapId: string): void {
    this.statusText.setText(`Player: ${playerName}  |  Class: ${classId}  |  Map: ${mapId}`);
  }

  setNotice(text: string): void {
    this.noticeText.setText(text);
  }

  setInteractionPromptVisible(visible: boolean, text: string): void {
    this.interactionPromptText.setVisible(visible);
    if (visible) {
      this.interactionPromptText.setText(text);
    }
  }

  setEncounterPromptVisible(visible: boolean, text: string): void {
    this.encounterPromptText.setVisible(visible);
    if (visible) {
      this.encounterPromptText.setText(text);
    }
  }

  destroy(): void {
    this.frameTop.destroy();
    this.frameBottom.destroy();
    this.statusText.destroy();
    this.controlsText.destroy();
    this.noticeText.destroy();
    this.interactionPromptText.destroy();
    this.encounterPromptText.destroy();
  }
}
