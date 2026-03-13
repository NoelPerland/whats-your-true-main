import Phaser from 'phaser';

import {
  OVERWORLD_PLAYER_VISUAL_CONFIG,
  type OverworldFacingDirection,
} from '../../assets/ninjaAdventureAssetCatalog';
import { ASSET_KEYS } from '../../core/constants/assetKeys';
import {
  ensureOverworldPlayerAnimations,
  type OverworldPlayerAnimationSet,
} from '../animation/OverworldPlayerAnimationRegistry';
import type { WorldPosition } from './OverworldRuntimeHelpers';
import { logger } from '../../utils/logger';

const FALLBACK_WIDTH = 24;
const FALLBACK_HEIGHT = 30;

export interface OverworldPlayerVisual {
  getPosition(): WorldPosition;
  setPosition(x: number, y: number): void;
  setMovementDirection(direction: WorldPosition): void;
  setRenderDepth(depth: number): void;
  getCollisionHalfExtents(): { halfWidth: number; halfHeight: number };
  destroy(): void;
}

const resolveFacingDirection = (
  previous: OverworldFacingDirection,
  direction: WorldPosition,
): OverworldFacingDirection => {
  if (direction.x === 0 && direction.y === 0) {
    return previous;
  }

  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    return direction.x < 0 ? 'left' : 'right';
  }

  return direction.y < 0 ? 'up' : 'down';
};

class SpritePlayerVisual implements OverworldPlayerVisual {
  private currentAnimationKey = '';
  private facingDirection: OverworldFacingDirection = 'down';
  private readonly halfWidth = OVERWORLD_PLAYER_VISUAL_CONFIG.collisionWidth / 2;
  private readonly halfHeight = OVERWORLD_PLAYER_VISUAL_CONFIG.collisionHeight / 2;

  constructor(
    private readonly sprite: Phaser.GameObjects.Sprite,
    private readonly animationSet: OverworldPlayerAnimationSet,
  ) {
    this.playAnimation(this.animationSet.idleByDirection.down);
  }

  getPosition(): WorldPosition {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  setMovementDirection(direction: WorldPosition): void {
    this.facingDirection = resolveFacingDirection(this.facingDirection, direction);

    const isMoving = direction.x !== 0 || direction.y !== 0;
    const animationKey = isMoving
      ? this.animationSet.walkByDirection[this.facingDirection]
      : this.animationSet.idleByDirection[this.facingDirection];

    this.playAnimation(animationKey);
    this.sprite.setRotation(0);
  }

  setRenderDepth(depth: number): void {
    this.sprite.setDepth(depth);
  }

  getCollisionHalfExtents(): { halfWidth: number; halfHeight: number } {
    return { halfWidth: this.halfWidth, halfHeight: this.halfHeight };
  }

  destroy(): void {
    this.sprite.destroy();
  }

  private playAnimation(animationKey: string): void {
    if (this.currentAnimationKey === animationKey) {
      return;
    }

    this.currentAnimationKey = animationKey;
    this.sprite.play(animationKey, true);
  }
}

class RectanglePlayerVisual implements OverworldPlayerVisual {
  private readonly halfWidth = FALLBACK_WIDTH / 2;
  private readonly halfHeight = FALLBACK_HEIGHT / 2;

  constructor(private readonly rectangle: Phaser.GameObjects.Rectangle) {}

  getPosition(): WorldPosition {
    return { x: this.rectangle.x, y: this.rectangle.y };
  }

  setPosition(x: number, y: number): void {
    this.rectangle.setPosition(x, y);
  }

  setMovementDirection(_direction: WorldPosition): void {
    // Fallback rectangle has no animation state.
  }

  setRenderDepth(depth: number): void {
    this.rectangle.setDepth(depth);
  }

  getCollisionHalfExtents(): { halfWidth: number; halfHeight: number } {
    return { halfWidth: this.halfWidth, halfHeight: this.halfHeight };
  }

  destroy(): void {
    this.rectangle.destroy();
  }
}

const createSpriteVisual = (scene: Phaser.Scene, spawn: WorldPosition): OverworldPlayerVisual | null => {
  const animationSet = ensureOverworldPlayerAnimations(scene);
  if (!animationSet) {
    return null;
  }

  const sprite = scene.add
    .sprite(spawn.x, spawn.y, ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET, 0)
    .setScale(OVERWORLD_PLAYER_VISUAL_CONFIG.scale)
    .setOrigin(0.5, 0.5);

  return new SpritePlayerVisual(sprite, animationSet);
};

const createRectangleVisual = (scene: Phaser.Scene, spawn: WorldPosition): OverworldPlayerVisual => {
  const fallback = scene.add.rectangle(spawn.x, spawn.y, FALLBACK_WIDTH, FALLBACK_HEIGHT, 0x79c6ff, 1);
  fallback.setStrokeStyle(2, 0x102b40, 1);
  return new RectanglePlayerVisual(fallback);
};

export const createOverworldPlayerVisual = (scene: Phaser.Scene, spawn: WorldPosition): OverworldPlayerVisual => {
  const spriteVisual = createSpriteVisual(scene, spawn);
  if (spriteVisual) {
    return spriteVisual;
  }

  logger.warn('Using rectangle fallback for overworld player because sprite animations were unavailable.');
  return createRectangleVisual(scene, spawn);
};
