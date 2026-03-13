import Phaser from 'phaser';

import { ANIMATION_KEYS } from '../../core/constants/animationKeys';
import { ASSET_KEYS } from '../../core/constants/assetKeys';
import type { OverworldAmbientAnchorSet } from '../../data/types/OverworldGeneration';

export interface OverworldAmbientEffectsHandle {
  destroy(): void;
}

interface OverworldAmbientEffectsConfig {
  anchors: OverworldAmbientAnchorSet;
  depthBase: number;
}

const toAnimationFrames = (textureKey: string, frames: readonly number[]): Phaser.Types.Animations.AnimationFrame[] => {
  return frames.map((frame) => ({ key: textureKey, frame }));
};

const collectFrames = (scene: Phaser.Scene, textureKey: string, frameCount: number): number[] => {
  if (!scene.textures.exists(textureKey)) {
    return [];
  }

  const texture = scene.textures.get(textureKey);
  const frames: number[] = [];
  for (let frame = 0; frame < frameCount; frame += 1) {
    if (texture.has(`${frame}`)) {
      frames.push(frame);
    }
  }

  return frames;
};

const ensureLoopAnimation = (
  scene: Phaser.Scene,
  animationKey: string,
  textureKey: string,
  frames: readonly number[],
  frameRate: number,
): string | null => {
  if (!scene.textures.exists(textureKey)) {
    return null;
  }

  if (scene.anims.exists(animationKey)) {
    return animationKey;
  }

  if (frames.length === 0) {
    return null;
  }

  scene.anims.create({
    key: animationKey,
    frames: toAnimationFrames(textureKey, frames),
    frameRate,
    repeat: -1,
  });

  return animationKey;
};

class OverworldAmbientEffects implements OverworldAmbientEffectsHandle {
  private readonly objects: Phaser.GameObjects.GameObject[] = [];
  private readonly tweens: Phaser.Tweens.Tween[] = [];
  private particleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: OverworldAmbientEffectsConfig,
  ) {
    this.createAmbientSprites();
    this.createLeafParticles();
  }

  destroy(): void {
    for (const tween of this.tweens) {
      tween.stop();
      tween.remove();
    }

    for (const object of this.objects) {
      object.destroy();
    }

    this.particleEmitter?.destroy();
  }

  private createAmbientSprites(): void {
    this.createWaterRipples();
    this.createFlowerSway();
    this.createFlags();
    this.createLanternFlicker();
  }

  private createWaterRipples(): void {
    const animationKey = ensureLoopAnimation(
      this.scene,
      ANIMATION_KEYS.OVERWORLD_AMBIENT_WATER_RIPPLE,
      ASSET_KEYS.OVERWORLD_AMBIENT_WATER_RIPPLES_SHEET,
      collectFrames(this.scene, ASSET_KEYS.OVERWORLD_AMBIENT_WATER_RIPPLES_SHEET, 4),
      4,
    );

    if (!animationKey) {
      return;
    }

    for (const point of this.config.anchors.waterRipplePoints) {
      const ripple = this.scene.add
        .sprite(point.x, point.y, ASSET_KEYS.OVERWORLD_AMBIENT_WATER_RIPPLES_SHEET, 0)
        .setScale(1.15)
        .setAlpha(0.35)
        .setDepth(this.config.depthBase + 0.3);
      ripple.play(animationKey, true);

      const rippleTween = this.scene.tweens.add({
        targets: ripple,
        alpha: { from: 0.28, to: 0.42 },
        duration: 1800 + Math.floor(Math.random() * 700),
        yoyo: true,
        repeat: -1,
      });

      this.objects.push(ripple);
      this.tweens.push(rippleTween);
    }
  }

  private createFlowerSway(): void {
    const animationKey = ensureLoopAnimation(
      this.scene,
      ANIMATION_KEYS.OVERWORLD_AMBIENT_FLOWER_SWAY,
      ASSET_KEYS.OVERWORLD_AMBIENT_FLOWER_SHEET,
      collectFrames(this.scene, ASSET_KEYS.OVERWORLD_AMBIENT_FLOWER_SHEET, 4),
      5,
    );

    if (!animationKey) {
      return;
    }

    for (const point of this.config.anchors.flowerPoints) {
      const flower = this.scene.add
        .sprite(point.x, point.y, ASSET_KEYS.OVERWORLD_AMBIENT_FLOWER_SHEET, 0)
        .setScale(1.1)
        .setDepth(this.config.depthBase + point.y * 0.01);
      flower.play(animationKey, true);

      const swayTween = this.scene.tweens.add({
        targets: flower,
        y: point.y + 1.4,
        duration: 1700 + Math.floor(Math.random() * 700),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      this.objects.push(flower);
      this.tweens.push(swayTween);
    }
  }

  private createFlags(): void {
    const animationKey = ensureLoopAnimation(
      this.scene,
      ANIMATION_KEYS.OVERWORLD_AMBIENT_FLAG_RED_WAVE,
      ASSET_KEYS.OVERWORLD_AMBIENT_FLAG_RED_SHEET,
      collectFrames(this.scene, ASSET_KEYS.OVERWORLD_AMBIENT_FLAG_RED_SHEET, 4),
      7,
    );

    if (!animationKey) {
      return;
    }

    for (const point of this.config.anchors.flagPoints) {
      const flag = this.scene.add
        .sprite(point.x, point.y, ASSET_KEYS.OVERWORLD_AMBIENT_FLAG_RED_SHEET, 0)
        .setScale(1.25)
        .setDepth(this.config.depthBase + point.y * 0.01 + 0.4);
      flag.play(animationKey, true);

      const floatTween = this.scene.tweens.add({
        targets: flag,
        y: point.y + 0.9,
        duration: 2000 + Math.floor(Math.random() * 900),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      this.objects.push(flag);
      this.tweens.push(floatTween);
    }
  }

  private createLanternFlicker(): void {
    for (const point of this.config.anchors.lanternPoints) {
      const post = this.scene.add
        .image(point.x, point.y + 3, ASSET_KEYS.PIXEL)
        .setDisplaySize(2, 8)
        .setTint(0x5a4026)
        .setAlpha(0.9)
        .setDepth(this.config.depthBase + point.y * 0.01 + 0.34);

      const lanternCore = this.scene.add
        .image(point.x, point.y, ASSET_KEYS.PIXEL)
        .setDisplaySize(5, 5)
        .setTint(0xffd58e)
        .setAlpha(0.65)
        .setDepth(this.config.depthBase + point.y * 0.01 + 0.36);

      const glow = this.scene.add
        .image(point.x, point.y + 1, ASSET_KEYS.PIXEL)
        .setDisplaySize(13, 13)
        .setTint(0xffd176)
        .setAlpha(0.18)
        .setDepth(this.config.depthBase + point.y * 0.01 + 0.35);

      const flickerTween = this.scene.tweens.add({
        targets: [glow, lanternCore],
        alpha: { from: 0.22, to: 0.38 },
        duration: 900 + Math.floor(Math.random() * 520),
        yoyo: true,
        repeat: -1,
      });

      const driftTween = this.scene.tweens.add({
        targets: glow,
        y: point.y + 2,
        duration: 1800 + Math.floor(Math.random() * 500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      this.objects.push(post, lanternCore, glow);
      this.tweens.push(flickerTween, driftTween);
    }
  }

  private createLeafParticles(): void {
    const leafArea = this.config.anchors.leafArea;
    if (
      leafArea.width <= 0 ||
      leafArea.height <= 0 ||
      !this.scene.textures.exists(ASSET_KEYS.OVERWORLD_AMBIENT_LEAF_PARTICLE_SHEET)
    ) {
      return;
    }

    this.particleEmitter = this.scene.add.particles(0, 0, ASSET_KEYS.OVERWORLD_AMBIENT_LEAF_PARTICLE_SHEET, {
      x: {
        min: leafArea.x,
        max: leafArea.x + leafArea.width,
      },
      y: {
        min: leafArea.y,
        max: leafArea.y + 12,
      },
      frame: [0, 1, 2, 3, 4, 5],
      frequency: 1400,
      quantity: 1,
      lifespan: 9000,
      speedX: {
        min: -16,
        max: 16,
      },
      speedY: {
        min: 16,
        max: 32,
      },
      gravityY: 6,
      scale: {
        start: 1.15,
        end: 0.65,
      },
      alpha: {
        start: 0.34,
        end: 0.04,
      },
      rotate: {
        min: -8,
        max: 8,
      },
      blendMode: Phaser.BlendModes.NORMAL,
    });
    this.particleEmitter.setDepth(this.config.depthBase + 0.2);
  }
}

export const createOverworldAmbientEffects = (
  scene: Phaser.Scene,
  config: OverworldAmbientEffectsConfig,
): OverworldAmbientEffectsHandle => {
  return new OverworldAmbientEffects(scene, config);
};
