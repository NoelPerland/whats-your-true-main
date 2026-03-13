import Phaser from 'phaser';

import type { BattleSpriteConfig } from '../battle/BattleVisualCatalog';

const collectFrameIndexes = (
  scene: Phaser.Scene,
  textureKey: string,
  frameStart: number,
  frameEnd: number,
): number[] => {
  if (!scene.textures.exists(textureKey)) {
    return [];
  }

  const texture = scene.textures.get(textureKey);
  const indexes: number[] = [];

  for (let frame = frameStart; frame <= frameEnd; frame += 1) {
    if (texture.has(`${frame}`)) {
      indexes.push(frame);
    }
  }

  return indexes;
};

export const ensureBattleLoopAnimation = (scene: Phaser.Scene, config: BattleSpriteConfig): string | null => {
  if (!scene.textures.exists(config.textureKey)) {
    return null;
  }

  if (scene.anims.exists(config.animationKey)) {
    return config.animationKey;
  }

  const frames = collectFrameIndexes(scene, config.textureKey, config.frameStart, config.frameEnd);
  if (frames.length === 0) {
    return null;
  }

  scene.anims.create({
    key: config.animationKey,
    frames: frames.map((frame) => ({ key: config.textureKey, frame })),
    frameRate: config.frameRate,
    repeat: -1,
  });

  return config.animationKey;
};
