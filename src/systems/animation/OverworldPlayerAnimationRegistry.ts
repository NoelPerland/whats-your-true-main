import Phaser from 'phaser';

import {
  OVERWORLD_FACING_DIRECTIONS,
  OVERWORLD_PLAYER_DIRECTION_ROW,
  OVERWORLD_PLAYER_FRAME_COUNT_PER_ROW,
  type OverworldFacingDirection,
} from '../../assets/ninjaAdventureAssetCatalog';
import { ANIMATION_KEYS } from '../../core/constants/animationKeys';
import { ASSET_KEYS } from '../../core/constants/assetKeys';
import { logger } from '../../utils/logger';

export interface OverworldPlayerAnimationSet {
  idleByDirection: Record<OverworldFacingDirection, string>;
  walkByDirection: Record<OverworldFacingDirection, string>;
  attackByDirection: Partial<Record<OverworldFacingDirection, string>>;
}

const IDLE_ANIMATION_KEYS: Record<OverworldFacingDirection, string> = {
  down: ANIMATION_KEYS.OVERWORLD_PLAYER_IDLE_DOWN,
  left: ANIMATION_KEYS.OVERWORLD_PLAYER_IDLE_LEFT,
  right: ANIMATION_KEYS.OVERWORLD_PLAYER_IDLE_RIGHT,
  up: ANIMATION_KEYS.OVERWORLD_PLAYER_IDLE_UP,
};

const WALK_ANIMATION_KEYS: Record<OverworldFacingDirection, string> = {
  down: ANIMATION_KEYS.OVERWORLD_PLAYER_WALK_DOWN,
  left: ANIMATION_KEYS.OVERWORLD_PLAYER_WALK_LEFT,
  right: ANIMATION_KEYS.OVERWORLD_PLAYER_WALK_RIGHT,
  up: ANIMATION_KEYS.OVERWORLD_PLAYER_WALK_UP,
};

const ATTACK_ANIMATION_KEYS: Partial<Record<OverworldFacingDirection, string>> = {
  down: ANIMATION_KEYS.OVERWORLD_PLAYER_ATTACK_DOWN,
};

const collectRowFrames = (scene: Phaser.Scene, textureKey: string, row: number): number[] => {
  if (!scene.textures.exists(textureKey)) {
    return [];
  }

  const texture = scene.textures.get(textureKey);
  const rowStart = row * OVERWORLD_PLAYER_FRAME_COUNT_PER_ROW;
  const frames: number[] = [];

  for (let offset = 0; offset < OVERWORLD_PLAYER_FRAME_COUNT_PER_ROW; offset += 1) {
    const frame = rowStart + offset;
    if (texture.has(`${frame}`)) {
      frames.push(frame);
    }
  }

  return frames;
};

const toAnimationFrames = (textureKey: string, frameIndexes: number[]): Phaser.Types.Animations.AnimationFrame[] => {
  return frameIndexes.map((frame) => ({ key: textureKey, frame }));
};

const ensureLoopAnimation = (
  scene: Phaser.Scene,
  animationKey: string,
  textureKey: string,
  frameIndexes: number[],
  frameRate: number,
): boolean => {
  if (scene.anims.exists(animationKey)) {
    return true;
  }

  if (frameIndexes.length === 0) {
    return false;
  }

  scene.anims.create({
    key: animationKey,
    frames: toAnimationFrames(textureKey, frameIndexes),
    frameRate,
    repeat: -1,
  });

  return true;
};

const registerIdleAnimations = (scene: Phaser.Scene): boolean => {
  let allRegistered = true;

  for (const direction of OVERWORLD_FACING_DIRECTIONS) {
    const row = OVERWORLD_PLAYER_DIRECTION_ROW[direction];
    const rowFrames = collectRowFrames(scene, ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET, row);
    const idleFrame = rowFrames[0] !== undefined ? [rowFrames[0]] : [];
    const registered = ensureLoopAnimation(
      scene,
      IDLE_ANIMATION_KEYS[direction],
      ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET,
      idleFrame,
      1,
    );

    allRegistered = allRegistered && registered;
  }

  return allRegistered;
};

const registerWalkAnimations = (scene: Phaser.Scene): boolean => {
  let allRegistered = true;

  for (const direction of OVERWORLD_FACING_DIRECTIONS) {
    const row = OVERWORLD_PLAYER_DIRECTION_ROW[direction];
    const walkFrames = collectRowFrames(scene, ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET, row);
    const registered = ensureLoopAnimation(
      scene,
      WALK_ANIMATION_KEYS[direction],
      ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET,
      walkFrames,
      10,
    );

    allRegistered = allRegistered && registered;
  }

  return allRegistered;
};

const registerOptionalAttackAnimations = (scene: Phaser.Scene): Partial<Record<OverworldFacingDirection, string>> => {
  const registeredDirections: Partial<Record<OverworldFacingDirection, string>> = {};
  const attackDirection: OverworldFacingDirection = 'down';
  const animationKey = ATTACK_ANIMATION_KEYS[attackDirection];

  if (!animationKey) {
    return registeredDirections;
  }

  const attackFrames = collectRowFrames(scene, ASSET_KEYS.OVERWORLD_PLAYER_ATTACK_SHEET, 0);
  const registered = ensureLoopAnimation(
    scene,
    animationKey,
    ASSET_KEYS.OVERWORLD_PLAYER_ATTACK_SHEET,
    attackFrames,
    12,
  );

  if (registered) {
    registeredDirections[attackDirection] = animationKey;
  }

  return registeredDirections;
};

export const ensureOverworldPlayerAnimations = (scene: Phaser.Scene): OverworldPlayerAnimationSet | null => {
  const hasIdle = registerIdleAnimations(scene);
  const hasWalk = registerWalkAnimations(scene);
  const attackByDirection = registerOptionalAttackAnimations(scene);

  if (!hasIdle || !hasWalk) {
    logger.warn('Overworld player animations could not be fully registered. Fallback visuals may be used.');
    return null;
  }

  return {
    idleByDirection: IDLE_ANIMATION_KEYS,
    walkByDirection: WALK_ANIMATION_KEYS,
    attackByDirection,
  };
};
