import type Phaser from 'phaser';

import type { SceneKey } from '../constants/sceneKeys';
import { logger } from '../../utils/logger';

const hasSceneKey = (scene: Phaser.Scene, key: SceneKey): boolean => {
  return Object.prototype.hasOwnProperty.call(scene.game.scene.keys, key);
};

export class SceneNavigator {
  static has(scene: Phaser.Scene, key: SceneKey): boolean {
    return hasSceneKey(scene, key);
  }

  static start(scene: Phaser.Scene, key: SceneKey, data?: unknown): boolean {
    if (!hasSceneKey(scene, key)) {
      logger.warn(`Cannot start scene "${key}" because it is not registered.`);
      return false;
    }

    scene.scene.start(key, data as never);
    return true;
  }
}
