import Phaser from 'phaser';

export interface DialoguePayload {
  speaker: string;
  lines: string[];
}

export class SimpleDialoguePanel {
  private readonly container: Phaser.GameObjects.Container;
  private readonly speakerPlate: Phaser.GameObjects.Rectangle;
  private readonly speakerText: Phaser.GameObjects.Text;
  private readonly bodyText: Phaser.GameObjects.Text;
  private readonly hintText: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene) {
    const panelWidth = scene.scale.width - 76;
    const panelHeight = 150;
    const panelX = 38;
    const panelY = scene.scale.height - panelHeight - 16;

    const shadow = scene.add
      .rectangle(panelX + 6, panelY + 8, panelWidth, panelHeight, 0x000000, 0.36)
      .setOrigin(0);

    const background = scene.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x0f1830, 0.95)
      .setOrigin(0)
      .setStrokeStyle(2, 0x89a9e0, 0.96);

    this.speakerPlate = scene.add
      .rectangle(panelX + 18, panelY + 8, 240, 34, 0x1e3158, 0.96)
      .setOrigin(0)
      .setStrokeStyle(1, 0xb8d0ff, 0.85);

    this.speakerText = scene.add
      .text(panelX + 30, panelY + 14, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#ffe18f',
        stroke: '#1b2138',
        strokeThickness: 4,
      })
      .setOrigin(0, 0);

    this.bodyText = scene.add
      .text(panelX + 24, panelY + 52, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#eef4ff',
        wordWrap: { width: panelWidth - 48 },
      })
      .setOrigin(0, 0)
      .setLineSpacing(8);

    this.hintText = scene.add
      .text(panelX + panelWidth - 20, panelY + panelHeight - 12, 'Enter/Space: close', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#c1d3f3',
      })
      .setOrigin(1, 1);

    this.container = scene.add.container(0, 0, [shadow, background, this.speakerPlate, this.speakerText, this.bodyText, this.hintText]);
    this.container.setDepth(100);
    this.container.setVisible(false);
  }

  show(payload: DialoguePayload): void {
    this.speakerText.setText(payload.speaker);
    this.bodyText.setText(payload.lines.join('\n'));
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }

  isOpen(): boolean {
    return this.container.visible;
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
