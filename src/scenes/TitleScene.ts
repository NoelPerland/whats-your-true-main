import Phaser from 'phaser';

import { ASSET_KEYS } from '../core/constants/assetKeys';
import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { STORAGE_KEYS } from '../core/constants/storageKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import { GameSessionStore, gameSessionStore } from '../core/state/GameSessionStore';
import type { TitleMenuAction } from '../data/types/Content';
import type { CharacterCreationSceneData, OverworldSceneData } from '../data/types/SceneData';
import { ContentLoader } from '../systems/content/ContentLoader';
import { SaveSystem } from '../systems/save/SaveSystem';
import { TitleMenu, type TitleMenuItem } from '../ui/title/TitleMenu';

export class TitleScene extends Phaser.Scene {
  private saveSystem!: SaveSystem;
  private sessionStore!: GameSessionStore;
  private statusText!: Phaser.GameObjects.Text;
  private titleMenu?: TitleMenu;

  constructor() {
    super(SCENE_KEYS.TITLE);
  }

  create(): void {
    this.saveSystem = this.resolveSaveSystem();
    this.sessionStore = this.resolveSessionStore();

    const titleConfig = ContentLoader.getTitleScreenConfig();

    this.renderBackground();
    this.renderPanel();
    this.renderLogo();
    this.renderTitleText(titleConfig.gameTitle, titleConfig.subtitle);

    const hasSave = this.saveSystem.hasSave();
    const menuItems: TitleMenuItem[] = titleConfig.menu.map((entry) => ({
      ...entry,
      enabled: entry.action !== 'load_game' || hasSave,
    }));

    this.statusText = this.add
      .text(this.scale.width / 2, this.scale.height - 60, hasSave ? '' : titleConfig.statusMessages.noSaveData, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#ffe082',
        align: 'center',
      })
      .setOrigin(0.5);

    this.titleMenu = new TitleMenu({
      scene: this,
      x: this.scale.width / 2,
      y: this.scale.height / 2 + 30,
      items: menuItems,
      onAction: (action) => {
        this.handleMenuAction(action);
      },
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.titleMenu?.destroy();
      this.titleMenu = undefined;
    });
  }

  private handleMenuAction(action: TitleMenuAction): void {
    const titleConfig = ContentLoader.getTitleScreenConfig();

    if (action === 'new_game') {
      const template = ContentLoader.getDefaultSessionTemplate();
      const seededSession = this.sessionStore.seedFromTemplate(template);
      this.statusText.setText(titleConfig.statusMessages.newGameReady);

      const sceneData: CharacterCreationSceneData = {
        sessionSeed: seededSession,
      };
      const transitioned = SceneNavigator.start(this, SCENE_KEYS.CHARACTER_CREATION, sceneData);

      if (!transitioned) {
        this.statusText.setText(titleConfig.statusMessages.characterCreationUnavailable);
      }

      return;
    }

    const loadedSession = this.saveSystem.load();
    if (!loadedSession) {
      this.statusText.setText(titleConfig.statusMessages.noSaveData);
      return;
    }

    this.sessionStore.setSession(loadedSession);
    this.statusText.setText(titleConfig.statusMessages.loadGameReady);

    const sceneData: OverworldSceneData = {
      restoredSession: loadedSession,
    };
    const transitioned = SceneNavigator.start(this, SCENE_KEYS.OVERWORLD, sceneData);

    if (!transitioned) {
      this.statusText.setText(titleConfig.statusMessages.overworldUnavailable);
    }
  }

  private resolveSaveSystem(): SaveSystem {
    const service = this.registry.get('saveSystem');
    if (service instanceof SaveSystem) {
      return service;
    }

    const fallback = new SaveSystem(STORAGE_KEYS.SAVE_SLOT_1);
    this.registry.set('saveSystem', fallback);
    return fallback;
  }

  private resolveSessionStore(): GameSessionStore {
    const service = this.registry.get('sessionStore');
    if (service instanceof GameSessionStore) {
      return service;
    }

    this.registry.set('sessionStore', gameSessionStore);
    return gameSessionStore;
  }

  private renderBackground(): void {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.TITLE_BG)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setTint(0x9ab6f0);
  }

  private renderPanel(): void {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2 + 50, ASSET_KEYS.UI_PANEL)
      .setDisplaySize(420, 250)
      .setTint(0x1a2f55)
      .setAlpha(0.92);
  }

  private renderLogo(): void {
    this.add
      .image(this.scale.width / 2, 130, ASSET_KEYS.TITLE_LOGO)
      .setDisplaySize(380, 96)
      .setTint(0xffe08a);
  }

  private renderTitleText(title: string, subtitle: string): void {
    this.add
      .text(this.scale.width / 2, 110, title, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '48px',
        color: '#f8f2d0',
        stroke: '#111111',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 165, subtitle, {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#d4e5ff',
        stroke: '#111111',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }
}
