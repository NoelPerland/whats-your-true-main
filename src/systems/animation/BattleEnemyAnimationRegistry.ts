import Phaser from 'phaser';

import { ASSET_KEYS } from '../../core/constants/assetKeys';
import { ANIMATION_KEYS } from '../../core/constants/animationKeys';

const collectFrameIndexes = (scene: Phaser.Scene, textureKey: string, start: number, end: number): number[] => {
  if (!scene.textures.exists(textureKey)) {
    return [];
  }

  const texture = scene.textures.get(textureKey);
  const indexes: number[] = [];

  for (let frame = start; frame <= end; frame += 1) {
    if (texture.has(`${frame}`)) {
      indexes.push(frame);
    }
  }

  return indexes;
};

export const ensureBattleEnemyAnimations = (scene: Phaser.Scene): boolean => {
  if (scene.anims.exists(ANIMATION_KEYS.BATTLE_ENEMY_BLUE_BAT_IDLE)) {
    return true;
  }

  const idleFrames = collectFrameIndexes(scene, ASSET_KEYS.BATTLE_ENEMY_BLUE_BAT_SHEET, 0, 3);
  if (idleFrames.length === 0) {
    return false;
  }

  scene.anims.create({
    key: ANIMATION_KEYS.BATTLE_ENEMY_BLUE_BAT_IDLE,
    frames: idleFrames.map((frame) => ({ key: ASSET_KEYS.BATTLE_ENEMY_BLUE_BAT_SHEET, frame })),
    frameRate: 8,
    repeat: -1,
  });

  return true;
};
