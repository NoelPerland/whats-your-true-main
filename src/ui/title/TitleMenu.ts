import Phaser from 'phaser';

import type { TitleMenuAction } from '../../data/types/Content';
import { TextButton } from '../common/TextButton';

export interface TitleMenuItem {
  id: string;
  label: string;
  action: TitleMenuAction;
  enabled: boolean;
}

interface TitleMenuOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  spacing?: number;
  items: TitleMenuItem[];
  onAction: (action: TitleMenuAction) => void;
}

export class TitleMenu {
  private readonly scene: Phaser.Scene;
  private readonly items: TitleMenuItem[];
  private readonly buttons: TextButton[] = [];

  private selectedIndex = -1;

  private readonly onMoveUp = (): void => this.moveSelection(-1);
  private readonly onMoveDown = (): void => this.moveSelection(1);
  private readonly onConfirm = (): void => this.confirmSelection();

  constructor(options: TitleMenuOptions) {
    this.scene = options.scene;
    this.items = options.items;

    const spacing = options.spacing ?? 56;

    options.items.forEach((item, index) => {
      const button = new TextButton({
        scene: this.scene,
        x: options.x,
        y: options.y + spacing * index,
        label: item.label,
        enabled: item.enabled,
        onHover: () => this.setSelection(index),
        onPressed: () => {
          if (!item.enabled) {
            return;
          }

          options.onAction(item.action);
        },
      });

      this.buttons.push(button);
    });

    this.selectedIndex = this.findNextEnabledIndex(0, 1);
    this.refreshSelectionState();
    this.registerInput();

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  destroy(): void {
    const keyboard = this.scene.input.keyboard;
    keyboard?.off('keydown-UP', this.onMoveUp);
    keyboard?.off('keydown-W', this.onMoveUp);
    keyboard?.off('keydown-DOWN', this.onMoveDown);
    keyboard?.off('keydown-S', this.onMoveDown);
    keyboard?.off('keydown-ENTER', this.onConfirm);
    keyboard?.off('keydown-SPACE', this.onConfirm);

    this.buttons.forEach((button) => button.destroy());
    this.buttons.length = 0;
  }

  private registerInput(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      return;
    }

    keyboard.on('keydown-UP', this.onMoveUp);
    keyboard.on('keydown-W', this.onMoveUp);
    keyboard.on('keydown-DOWN', this.onMoveDown);
    keyboard.on('keydown-S', this.onMoveDown);
    keyboard.on('keydown-ENTER', this.onConfirm);
    keyboard.on('keydown-SPACE', this.onConfirm);
  }

  private setSelection(index: number): void {
    if (!this.items[index]?.enabled) {
      return;
    }

    this.selectedIndex = index;
    this.refreshSelectionState();
  }

  private moveSelection(direction: -1 | 1): void {
    if (this.buttons.length === 0 || this.selectedIndex < 0) {
      return;
    }

    const nextIndex = this.findNextEnabledIndex(this.selectedIndex + direction, direction);
    if (nextIndex === -1) {
      return;
    }

    this.selectedIndex = nextIndex;
    this.refreshSelectionState();
  }

  private confirmSelection(): void {
    if (this.selectedIndex < 0) {
      return;
    }

    this.buttons[this.selectedIndex]?.press();
  }

  private findNextEnabledIndex(startIndex: number, direction: -1 | 1): number {
    if (this.items.length === 0) {
      return -1;
    }

    for (let offset = 0; offset < this.items.length; offset += 1) {
      const wrappedIndex = Phaser.Math.Wrap(startIndex + direction * offset, 0, this.items.length);
      if (this.items[wrappedIndex]?.enabled) {
        return wrappedIndex;
      }
    }

    return -1;
  }

  private refreshSelectionState(): void {
    this.buttons.forEach((button, index) => {
      button.setSelected(index === this.selectedIndex);
    });
  }
}
