import Phaser from 'phaser';

import type { BattleActorState } from '../../data/types/Battle';

interface HpWidgets {
  panel: Phaser.GameObjects.Rectangle;
  hpLabel: Phaser.GameObjects.Text;
  hpValue: Phaser.GameObjects.Text;
  barFrame: Phaser.GameObjects.Rectangle;
  barFill: Phaser.GameObjects.Rectangle;
  maxBarWidth: number;
  tween?: Phaser.Tweens.Tween;
  displayedHp: number;
}

const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * t;
};

export class BattleHud {
  private readonly turnText: Phaser.GameObjects.Text;
  private readonly logPanel: Phaser.GameObjects.Rectangle;
  private readonly logText: Phaser.GameObjects.Text;
  private readonly hintText: Phaser.GameObjects.Text;

  private readonly playerWidgets: HpWidgets;
  private readonly enemyWidgets: HpWidgets;

  constructor(private readonly scene: Phaser.Scene) {
    this.playerWidgets = this.createHpWidgets(36, 24, 0x8ec5ff, 'PLAYER');
    this.enemyWidgets = this.createHpWidgets(scene.scale.width - 36 - 260, 24, 0xffb0b0, 'ENEMY');

    this.turnText = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 220, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '22px',
        color: '#ffe9a3',
        stroke: '#1e1731',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(40);

    this.logPanel = scene.add
      .rectangle(scene.scale.width / 2, scene.scale.height - 150, scene.scale.width - 84, 84, 0x151b33, 0.87)
      .setStrokeStyle(2, 0x6f83b7, 0.9)
      .setDepth(40);

    this.logText = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 150, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#edf3ff',
        align: 'center',
        wordWrap: { width: scene.scale.width - 120 },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(41);

    this.hintText = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 22, 'Up/Down: Select  |  Enter/Space: Confirm', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#a8badf',
      })
      .setOrigin(0.5, 1)
      .setDepth(42);
  }

  setCombatants(playerActor: BattleActorState, enemyActor: BattleActorState): void {
    this.updateActorWidgets(this.playerWidgets, playerActor, 0x7cd2a6);
    this.updateActorWidgets(this.enemyWidgets, enemyActor, 0xec7f7f);
  }

  setTurnText(text: string): void {
    this.turnText.setText(text);
  }

  setLogText(text: string): void {
    this.logText.setText(text);
  }

  destroy(): void {
    this.destroyWidgets(this.playerWidgets);
    this.destroyWidgets(this.enemyWidgets);
    this.turnText.destroy();
    this.logPanel.destroy();
    this.logText.destroy();
    this.hintText.destroy();
  }

  private createHpWidgets(x: number, y: number, titleColor: number, title: string): HpWidgets {
    const panel = this.scene.add
      .rectangle(x, y, 260, 58, 0x121932, 0.84)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x425b8b, 0.9)
      .setDepth(40);

    const hpLabel = this.scene.add
      .text(x + 12, y + 7, title, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '13px',
        color: Phaser.Display.Color.IntegerToColor(titleColor).rgba,
      })
      .setOrigin(0, 0)
      .setDepth(41);

    const hpValue = this.scene.add
      .text(x + 12, y + 25, 'HP 0/0', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#ecf4ff',
      })
      .setOrigin(0, 0)
      .setDepth(41);

    const barFrame = this.scene.add
      .rectangle(x + 118, y + 26, 130, 16, 0x0b1124, 1)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x5f74a1, 1)
      .setDepth(41);

    const barFill = this.scene.add
      .rectangle(x + 120, y + 28, 126, 12, 0x7cd2a6, 1)
      .setOrigin(0, 0)
      .setDepth(42);

    return {
      panel,
      hpLabel,
      hpValue,
      barFrame,
      barFill,
      maxBarWidth: 126,
      displayedHp: 0,
    };
  }

  private updateActorWidgets(widgets: HpWidgets, actor: BattleActorState, barColor: number): void {
    widgets.hpLabel.setText(actor.name.toUpperCase());
    widgets.hpValue.setText(`HP ${actor.hp}/${actor.maxHp}`);
    widgets.barFill.setFillStyle(barColor, 1);

    const targetHp = Math.max(0, actor.hp);
    const startHp = widgets.displayedHp;

    widgets.tween?.stop();
    widgets.tween?.remove();

    if (startHp === targetHp) {
      this.setBarFromRatio(widgets, actor.maxHp > 0 ? targetHp / actor.maxHp : 0);
      return;
    }

    widgets.tween = this.scene.tweens.addCounter({
      from: startHp,
      to: targetHp,
      duration: 360,
      ease: 'Sine.Out',
      onUpdate: (tween) => {
        const currentHp = tween.getValue() ?? startHp;
        const ratio = actor.maxHp > 0 ? currentHp / actor.maxHp : 0;
        this.setBarFromRatio(widgets, ratio);
      },
      onComplete: () => {
        widgets.displayedHp = targetHp;
      },
    });

    widgets.displayedHp = targetHp;
  }

  private setBarFromRatio(widgets: HpWidgets, ratio: number): void {
    const clamped = Phaser.Math.Clamp(ratio, 0, 1);
    const width = Math.max(2, Math.round(lerp(0, widgets.maxBarWidth, clamped)));
    widgets.barFill.width = width;
  }

  private destroyWidgets(widgets: HpWidgets): void {
    widgets.tween?.stop();
    widgets.tween?.remove();
    widgets.panel.destroy();
    widgets.hpLabel.destroy();
    widgets.hpValue.destroy();
    widgets.barFrame.destroy();
    widgets.barFill.destroy();
  }
}

