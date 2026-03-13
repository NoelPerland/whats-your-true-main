import Phaser from 'phaser';

import { ANIMATION_KEYS } from '../../core/constants/animationKeys';
import { ASSET_KEYS } from '../../core/constants/assetKeys';

const NPC_IDLE_FRAMES = [0];

const toAnimationFrames = (textureKey: string, frameIndexes: number[]): Phaser.Types.Animations.AnimationFrame[] => {
  return frameIndexes.map((frame) => ({ key: textureKey, frame }));
};

export const ensureOverworldGuideNpcIdleAnimation = (scene: Phaser.Scene): string | null => {
  if (!scene.textures.exists(ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET)) {
    return null;
  }

  if (scene.anims.exists(ANIMATION_KEYS.OVERWORLD_NPC_GUIDE_IDLE)) {
    return ANIMATION_KEYS.OVERWORLD_NPC_GUIDE_IDLE;
  }

  const texture = scene.textures.get(ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET);
  const validFrames = NPC_IDLE_FRAMES.filter((frame) => texture.has(`${frame}`));
  if (validFrames.length === 0) {
    return null;
  }

  scene.anims.create({
    key: ANIMATION_KEYS.OVERWORLD_NPC_GUIDE_IDLE,
    frames: toAnimationFrames(ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET, validFrames),
    frameRate: 6,
    repeat: -1,
  });

  return ANIMATION_KEYS.OVERWORLD_NPC_GUIDE_IDLE;
};
