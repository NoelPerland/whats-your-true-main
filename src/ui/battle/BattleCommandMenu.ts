import Phaser from 'phaser';

import type { BattleActionType } from '../../data/types/Battle';

interface BattleCommandMenuConfig {
  x: number;
  y: number;
  onCommandSelected: (command: BattleActionType) => void;
}

interface CommandEntry {
  id: BattleActionType;
  label: string;
}

interface CommandWidgets {
  background: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}

const COMMANDS: CommandEntry[] = [
  { id: 'attack', label: 'Attack' },
  { id: 'defend', label: 'Defend' },
];

export class BattleCommandMenu {
  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly cursorText: Phaser.GameObjects.Text;
  private readonly commandWidgets: CommandWidgets[] = [];
  private selectedIndex = 0;
  private isEnabled = false;

  private pulseTween?: Phaser.Tweens.Tween;

  private readonly onMoveUp = (): void => {
    this.moveSelection(-1);
  };

  private readonly onMoveDown = (): void => {
    this.moveSelection(1);
  };

  private readonly onConfirm = (): void => {
    this.confirmSelection();
  };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: BattleCommandMenuConfig,
  ) {
    this.panel = scene.add
      .rectangle(config.x, config.y, 320, 98, 0x131a30, 0.92)
      .setStrokeStyle(2, 0x6c84b5, 0.95)
      .setDepth(50);

    COMMANDS.forEach((command, index) => {
      const rowY = config.y - 18 + index * 38;

      const rowBackground = scene.add
        .rectangle(config.x, rowY, 258, 30, 0x2a335c, 0.18)
        .setDepth(51)
        .setStrokeStyle(1, 0x4a5e8a, 0.7);

      const text = scene.add
        .text(config.x, rowY, command.label, {
          fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
          fontSize: '24px',
          color: '#d8e6ff',
          stroke: '#0f1324',
          strokeThickness: 5,
        })
        .setOrigin(0.5, 0.5)
        .setDepth(52);

      this.commandWidgets.push({
        background: rowBackground,
        text,
      });
    });

    this.cursorText = scene.add
      .text(config.x - 124, config.y - 18, '>>', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#ffe38b',
        stroke: '#4a3a1b',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(53);

    this.pulseTween = scene.tweens.add({
      targets: this.cursorText,
      alpha: { from: 0.55, to: 1 },
      duration: 560,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.refreshVisualState();
    this.registerKeyboard();
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.refreshVisualState();
  }

  destroy(): void {
    this.scene.input.keyboard?.off('keydown-UP', this.onMoveUp);
    this.scene.input.keyboard?.off('keydown-DOWN', this.onMoveDown);
    this.scene.input.keyboard?.off('keydown-ENTER', this.onConfirm);
    this.scene.input.keyboard?.off('keydown-SPACE', this.onConfirm);

    this.pulseTween?.stop();
    this.pulseTween?.remove();

    this.panel.destroy();
    this.cursorText.destroy();

    this.commandWidgets.forEach((widgets) => {
      widgets.background.destroy();
      widgets.text.destroy();
    });

    this.commandWidgets.length = 0;
  }

  private registerKeyboard(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      return;
    }

    keyboard.on('keydown-UP', this.onMoveUp);
    keyboard.on('keydown-DOWN', this.onMoveDown);
    keyboard.on('keydown-ENTER', this.onConfirm);
    keyboard.on('keydown-SPACE', this.onConfirm);
  }

  private moveSelection(direction: -1 | 1): void {
    if (!this.isEnabled) {
      return;
    }

    this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex + direction, 0, COMMANDS.length);
    this.refreshVisualState();
  }

  private confirmSelection(): void {
    if (!this.isEnabled) {
      return;
    }

    const selectedCommand = COMMANDS[this.selectedIndex];
    if (!selectedCommand) {
      return;
    }

    this.config.onCommandSelected(selectedCommand.id);
  }

  private refreshVisualState(): void {
    this.panel.setAlpha(this.isEnabled ? 0.92 : 0.74);
    this.cursorText.setVisible(this.isEnabled);

    this.commandWidgets.forEach((widgets, index) => {
      const isSelected = index === this.selectedIndex;

      if (!this.isEnabled) {
        widgets.background.setFillStyle(0x2a335c, 0.08);
        widgets.text.setColor('#8394b6');
        return;
      }

      widgets.background.setFillStyle(isSelected ? 0x4c5f9e : 0x2a335c, isSelected ? 0.35 : 0.2);
      widgets.text.setColor(isSelected ? '#ffe7a0' : '#d8e6ff');

      if (isSelected) {
        this.cursorText.setPosition(this.config.x - 124, this.config.y - 18 + index * 38);
      }
    });
  }
}
