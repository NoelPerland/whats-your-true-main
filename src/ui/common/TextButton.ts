import type Phaser from 'phaser';

interface TextButtonOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  label: string;
  enabled?: boolean;
  onPressed: () => void;
  onHover?: () => void;
}

const BASE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
  fontSize: '30px',
  color: '#d9e5ff',
  stroke: '#0a1020',
  strokeThickness: 4,
};

export class TextButton {
  readonly textObject: Phaser.GameObjects.Text;

  private isEnabled = true;
  private isSelected = false;

  constructor(options: TextButtonOptions) {
    this.textObject = options.scene.add.text(options.x, options.y, options.label, BASE_STYLE).setOrigin(0.5);

    this.setEnabled(options.enabled ?? true);

    if (this.isEnabled) {
      this.textObject.on('pointerup', () => {
        options.onPressed();
      });

      this.textObject.on('pointerover', () => {
        options.onHover?.();
      });
    }

    this.refreshStyle();
  }

  setSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.refreshStyle();
  }

  setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;

    if (this.isEnabled) {
      this.textObject.setInteractive({ useHandCursor: true });
    } else {
      this.textObject.disableInteractive();
    }

    this.refreshStyle();
  }

  press(): void {
    if (!this.isEnabled) {
      return;
    }

    this.textObject.emit('pointerup');
  }

  destroy(): void {
    this.textObject.destroy();
  }

  private refreshStyle(): void {
    if (!this.isEnabled) {
      this.textObject.setColor('#7a86a1');
      this.textObject.setAlpha(0.75);
      return;
    }

    this.textObject.setAlpha(1);
    this.textObject.setColor(this.isSelected ? '#ffe082' : '#d9e5ff');
  }
}
