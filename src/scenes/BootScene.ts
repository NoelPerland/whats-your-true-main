import Phaser from 'phaser';

import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { STORAGE_KEYS } from '../core/constants/storageKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import { gameSessionStore } from '../core/state/GameSessionStore';
import { ContentLoader } from '../systems/content/ContentLoader';
import { SaveSystem } from '../systems/save/SaveSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  create(): void {
    this.initializeRuntimeServices();
    SceneNavigator.start(this, SCENE_KEYS.PRELOAD);
  }

  private initializeRuntimeServices(): void {
    const saveSystem = new SaveSystem(STORAGE_KEYS.SAVE_SLOT_1);

    this.registry.set('saveSystem', saveSystem);
    this.registry.set('sessionStore', gameSessionStore);
    this.registry.set('contentLoader', ContentLoader);
  }
}
