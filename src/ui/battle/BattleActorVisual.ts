import Phaser from 'phaser';

import type { BattleSpriteConfig } from '../../systems/battle/BattleVisualCatalog';
import { ensureBattleLoopAnimation } from '../../systems/animation/BattleActorAnimationRegistry';

interface BattleActorVisualConfig {
  x: number;
  y: number;
  kind: 'player' | 'enemy';
  label: string;
  spriteConfig?: BattleSpriteConfig;
}

const DAMAGE_FONT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
  fontSize: '30px',
  color: '#fff2d6',
  stroke: '#4a1a1a',
  strokeThickness: 6,
};

export class BattleActorVisual {
  private readonly root: Phaser.GameObjects.Container;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly labelText: Phaser.GameObjects.Text;

  private readonly bodyGraphics?: Phaser.GameObjects.Graphics;
  private readonly sprite?: Phaser.GameObjects.Sprite;

  private readonly baseX: number;
  private readonly baseY: number;

  private idleTween?: Phaser.Tweens.Tween;

  constructor(private readonly scene: Phaser.Scene, config: BattleActorVisualConfig) {
    this.baseX = config.x;
    this.baseY = config.y;

    this.shadow = scene.add
      .ellipse(config.x, config.y + 50, 116, 26, 0x000000, 0.26)
      .setDepth(9);

    this.root = scene.add.container(config.x, config.y).setDepth(10);

    this.labelText = scene.add
      .text(config.x, config.y + 80, config.label, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: config.kind === 'player' ? '#d7edff' : '#ffd7d7',
        stroke: '#0f1120',
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(11);

    if (config.spriteConfig && scene.textures.exists(config.spriteConfig.textureKey)) {
      const sprite = scene.add
        .sprite(0, 0, config.spriteConfig.textureKey, 0)
        .setScale(config.spriteConfig.scale)
        .setOrigin(0.5, 0.6);

      const animationKey = ensureBattleLoopAnimation(scene, config.spriteConfig);
      if (animationKey) {
        sprite.play(animationKey, true);
      }

      this.root.add(sprite);
      this.sprite = sprite;
    } else {
      const body = scene.add.graphics();
      if (config.kind === 'player') {
        body.fillStyle(0x6fb4ff, 1);
        body.fillRoundedRect(-34, -32, 68, 72, 14);
      } else {
        body.fillStyle(0x7bd97f, 1);
        body.fillEllipse(0, 8, 98, 68);
      }

      this.root.add(body);
      this.bodyGraphics = body;
    }

    this.startIdleMotion(config.kind);
  }

  setAliveState(isAlive: boolean): void {
    const alpha = isAlive ? 1 : 0.38;
    this.root.setAlpha(alpha);
    this.shadow.setAlpha(isAlive ? 0.26 : 0.12);
    this.labelText.setAlpha(isAlive ? 1 : 0.5);
  }

  playAttackLunge(targetX: number): void {
    const direction = Math.sign(targetX - this.baseX) || 1;

    this.scene.tweens.add({
      targets: this.root,
      x: this.baseX + direction * 24,
      duration: 95,
      yoyo: true,
      ease: 'Sine.InOut',
      onComplete: () => {
        this.root.setX(this.baseX);
      },
    });
  }

  playHitReaction(): void {
    if (this.sprite) {
      this.sprite.setTintFill(0xffffff);
      this.scene.time.delayedCall(110, () => {
        this.sprite?.clearTint();
      });
    } else {
      this.bodyGraphics?.setAlpha(0.35);
      this.scene.time.delayedCall(110, () => {
        this.bodyGraphics?.setAlpha(1);
      });
    }

    this.scene.tweens.add({
      targets: this.root,
      x: this.baseX + 8,
      duration: 42,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        this.root.setX(this.baseX);
      },
    });
  }

  showDamageNumber(amount: number): void {
    const damageText = this.scene.add
      .text(this.baseX + 10, this.baseY - 46, `-${amount}`, DAMAGE_FONT_STYLE)
      .setOrigin(0.5, 0.5)
      .setDepth(30);

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 36,
      alpha: 0,
      duration: 620,
      ease: 'Sine.Out',
      onComplete: () => {
        damageText.destroy();
      },
    });
  }

  getPositionX(): number {
    return this.baseX;
  }

  destroy(): void {
    this.idleTween?.stop();
    this.idleTween?.remove();

    this.shadow.destroy();
    this.labelText.destroy();
    this.root.destroy(true);
  }

  private startIdleMotion(kind: 'player' | 'enemy'): void {
    if (kind === 'player') {
      this.idleTween = this.scene.tweens.add({
        targets: this.root,
        y: this.baseY - 4,
        duration: 1150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      return;
    }

    this.idleTween = this.scene.tweens.add({
      targets: this.root,
      y: this.baseY - 8,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.scene.tweens.add({
      targets: this.root,
      scaleX: 1.08,
      scaleY: 0.9,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }
}
