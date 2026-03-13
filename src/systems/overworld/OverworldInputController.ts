import Phaser from 'phaser';

import type { AxisInputState } from './OverworldRuntimeHelpers';

interface MovementKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
}

export interface OverworldInputCallbacks {
  onExit: () => void;
  onInteract: () => void;
  onBattle: () => void;
}

export class OverworldInputController {
  private movementKeys?: MovementKeys;
  private keyboard?: Phaser.Input.Keyboard.KeyboardPlugin;

  private readonly onExitKey = (): void => {
    this.callbacks.onExit();
  };

  private readonly onInteractKey = (): void => {
    this.callbacks.onInteract();
  };

  private readonly onBattleKey = (): void => {
    this.callbacks.onBattle();
  };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly callbacks: OverworldInputCallbacks,
  ) {}

  initialize(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      return;
    }
    this.keyboard = keyboard;

    const cursors = keyboard.createCursorKeys();
    const wasdKeys = keyboard.addKeys('W,A,S,D') as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };

    const w = wasdKeys.W;
    const a = wasdKeys.A;
    const s = wasdKeys.S;
    const d = wasdKeys.D;

    if (!w || !a || !s || !d) {
      return;
    }

    this.movementKeys = {
      up: cursors.up,
      down: cursors.down,
      left: cursors.left,
      right: cursors.right,
      w,
      a,
      s,
      d,
    };

    keyboard.on('keydown-ESC', this.onExitKey);
    keyboard.on('keydown-ENTER', this.onInteractKey);
    keyboard.on('keydown-SPACE', this.onInteractKey);
    keyboard.on('keydown-B', this.onBattleKey);
  }

  getAxisInputState(): AxisInputState | null {
    if (!this.movementKeys) {
      return null;
    }

    return {
      left: this.movementKeys.left.isDown || this.movementKeys.a.isDown,
      right: this.movementKeys.right.isDown || this.movementKeys.d.isDown,
      up: this.movementKeys.up.isDown || this.movementKeys.w.isDown,
      down: this.movementKeys.down.isDown || this.movementKeys.s.isDown,
    };
  }

  destroy(): void {
    if (!this.keyboard) {
      return;
    }

    this.keyboard.off('keydown-ESC', this.onExitKey);
    this.keyboard.off('keydown-ENTER', this.onInteractKey);
    this.keyboard.off('keydown-SPACE', this.onInteractKey);
    this.keyboard.off('keydown-B', this.onBattleKey);
    this.keyboard = undefined;
    this.movementKeys = undefined;
  }
}
