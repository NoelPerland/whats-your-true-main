import Phaser from 'phaser';

import { resolveAssetPath } from '../assets/assetPaths';
import {
  resolveCharacterCreationClassModelAsset,
  resolveCharacterCreationPortraitAssetPath,
} from '../assets/characterCreationAssetCatalog';
import {
  SELECTED_NINJA_IMAGE_ASSETS,
  SELECTED_NINJA_SPRITESHEET_ASSETS,
} from '../assets/ninjaAdventureAssetCatalog';
import { ASSET_KEYS } from '../core/constants/assetKeys';
import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import type { AssetManifestEntry } from '../data/types/Content';
import { CharacterCreationContentLoader } from '../systems/content/CharacterCreationContentLoader';
import { ContentLoader } from '../systems/content/ContentLoader';
import { logger } from '../utils/logger';

export class PreloadScene extends Phaser.Scene {
  private manifestEntries: AssetManifestEntry[] = [];
  private classModelTextureKeys: string[] = [];
  private portraitTextureKeys: string[] = [];
  private readonly failedAssetKeys = new Set<string>();
  private progressText?: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload(): void {
    this.createProgressText();
    this.registerLoaderListeners();
    this.queueManifestAssets();
    this.queueSelectedImageAssets();
    this.queueSelectedSpritesheetAssets();
    this.queueClassModelTextures();
    this.queuePortraitTextures();
  }

  create(): void {
    this.ensureRequiredTextures();
    this.progressText?.destroy();

    SceneNavigator.start(this, SCENE_KEYS.TITLE);
  }

  private createProgressText(): void {
    this.progressText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Loading... 0%', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#d9e5ff',
      })
      .setOrigin(0.5);
  }

  private registerLoaderListeners(): void {
    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      const progressPercent = Math.round(value * 100);
      this.progressText?.setText(`Loading... ${progressPercent}%`);
    });

    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      this.failedAssetKeys.add(file.key);
      logger.warn(`Failed to load asset key "${file.key}". Fallback texture will be used.`);
    });
  }

  private queueManifestAssets(): void {
    this.manifestEntries = ContentLoader.getAssetManifest();

    const includesPixel = this.manifestEntries.some((entry) => entry.key === ASSET_KEYS.PIXEL);
    if (!includesPixel) {
      this.manifestEntries.unshift({
        key: ASSET_KEYS.PIXEL,
        type: 'image',
        assetId: 'PIXEL',
        required: true,
      });
    }

    for (const entry of this.manifestEntries) {
      const fallbackId = entry.fallbackAssetId ?? 'PIXEL';
      const assetUrl = resolveAssetPath(entry.assetId);
      const fallbackUrl = resolveAssetPath(fallbackId);

      if (!assetUrl) {
        logger.warn(`Asset path is missing for ${entry.assetId}. Using fallback for key "${entry.key}".`);
      }

      const resolvedUrl = assetUrl ?? fallbackUrl;
      if (!resolvedUrl) {
        logger.warn(`Both asset and fallback paths are missing for key "${entry.key}". Runtime texture fallback will be used.`);
        continue;
      }

      this.load.image(entry.key, resolvedUrl);
    }
  }

  private queueSelectedSpritesheetAssets(): void {
    for (const asset of SELECTED_NINJA_SPRITESHEET_ASSETS) {
      const assetUrl = resolveAssetPath(asset.assetId);
      if (!assetUrl) {
        logger.warn(`Asset path is missing for ${asset.assetId}. Spritesheet "${asset.key}" was skipped.`);
        continue;
      }

      this.load.spritesheet(asset.key, assetUrl, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      });
    }
  }

  private queueSelectedImageAssets(): void {
    for (const asset of SELECTED_NINJA_IMAGE_ASSETS) {
      const assetUrl = resolveAssetPath(asset.assetId);
      if (!assetUrl) {
        logger.warn(`Asset path is missing for ${asset.assetId}. Image "${asset.key}" was skipped.`);
        continue;
      }

      this.load.image(asset.key, assetUrl);
    }
  }

  private queuePortraitTextures(): void {
    const portraitOptions = CharacterCreationContentLoader.getPortraitOptions();
    const seenTextureKeys = new Set<string>();

    this.portraitTextureKeys = [];

    for (const portrait of portraitOptions) {
      if (seenTextureKeys.has(portrait.textureKey)) {
        continue;
      }

      seenTextureKeys.add(portrait.textureKey);
      this.portraitTextureKeys.push(portrait.textureKey);

      const portraitUrl = resolveCharacterCreationPortraitAssetPath(portrait.textureKey);
      if (!portraitUrl) {
        logger.warn(`Portrait texture path is missing for key "${portrait.textureKey}".`);
        continue;
      }

      this.load.image(portrait.textureKey, portraitUrl);
    }
  }

  private queueClassModelTextures(): void {
    const classDefinitions = CharacterCreationContentLoader.getClassDefinitions();
    const seenTextureKeys = new Set<string>();

    this.classModelTextureKeys = [];

    for (const classDefinition of classDefinitions) {
      const modelTextureKeys = [
        classDefinition.modelTextureByGender.male,
        classDefinition.modelTextureByGender.female,
      ];

      for (const modelTextureKey of modelTextureKeys) {
        if (seenTextureKeys.has(modelTextureKey)) {
          continue;
        }

        seenTextureKeys.add(modelTextureKey);
        this.classModelTextureKeys.push(modelTextureKey);

        const modelAsset = resolveCharacterCreationClassModelAsset(modelTextureKey);
        if (!modelAsset) {
          logger.warn(`Class model texture path is missing for key "${modelTextureKey}".`);
          continue;
        }

        this.load.spritesheet(modelAsset.textureKey, modelAsset.textureUrl, {
          frameWidth: modelAsset.frameWidth,
          frameHeight: modelAsset.frameHeight,
        });
      }
    }
  }

  private ensureRequiredTextures(): void {
    const requiredKeys = new Set<string>([
      ASSET_KEYS.PIXEL,
      ASSET_KEYS.TITLE_BG,
      ASSET_KEYS.TITLE_LOGO,
      ASSET_KEYS.UI_PANEL,
      ...this.classModelTextureKeys,
      ...this.portraitTextureKeys,
      ...SELECTED_NINJA_IMAGE_ASSETS.filter((asset) => asset.required).map((asset) => asset.key),
      ...SELECTED_NINJA_SPRITESHEET_ASSETS.filter((asset) => asset.required).map((asset) => asset.key),
      ...this.manifestEntries.filter((entry) => entry.required).map((entry) => entry.key),
    ]);

    for (const key of requiredKeys) {
      if (this.textures.exists(key)) {
        continue;
      }

      if (this.portraitTextureKeys.includes(key)) {
        this.createPortraitFallbackTexture(key);
      } else {
        this.createFallbackTexture(key);
      }
      logger.warn(`Generated runtime fallback texture for missing key "${key}".`);
    }

    for (const failedKey of this.failedAssetKeys) {
      if (this.textures.exists(failedKey)) {
        continue;
      }

      this.createFallbackTexture(failedKey);
      logger.warn(`Generated fallback texture for failed key "${failedKey}".`);
    }
  }

  private createFallbackTexture(key: string): void {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x111111, 1);
    graphics.fillRect(4, 4, 24, 24);
    graphics.generateTexture(key, 32, 32);
    graphics.destroy();
  }

  private createPortraitFallbackTexture(key: string): void {
    if (this.textures.exists(key)) {
      return;
    }

    let hash = 0;
    for (let index = 0; index < key.length; index += 1) {
      hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
    }

    const primaryColor = Phaser.Display.Color.HSVToRGB((hash % 360) / 360, 0.45, 0.95).color;
    const secondaryColor = Phaser.Display.Color.HSVToRGB(((hash + 120) % 360) / 360, 0.55, 0.75).color;
    const accentColor = Phaser.Display.Color.HSVToRGB(((hash + 220) % 360) / 360, 0.5, 0.9).color;
    const variant = hash % 3;

    const graphics = this.add.graphics();
    graphics.fillStyle(0x0f172b, 1);
    graphics.fillRect(0, 0, 96, 128);
    graphics.fillStyle(primaryColor, 1);
    graphics.fillRect(4, 4, 88, 120);
    graphics.fillStyle(secondaryColor, 1);
    graphics.fillRect(10, 10, 76, 108);

    if (variant === 0) {
      graphics.fillStyle(accentColor, 1);
      graphics.fillEllipse(48, 40, 38, 42);
      graphics.fillStyle(0x182942, 0.92);
      graphics.fillRect(26, 68, 44, 36);
      graphics.fillStyle(0xffffff, 0.5);
      graphics.fillRect(30, 18, 36, 4);
    } else if (variant === 1) {
      graphics.fillStyle(accentColor, 1);
      graphics.fillRoundedRect(30, 20, 36, 38, 8);
      graphics.fillStyle(0x182942, 0.92);
      graphics.fillEllipse(48, 84, 48, 38);
      graphics.fillStyle(0xffffff, 0.42);
      graphics.fillCircle(40, 34, 2);
      graphics.fillCircle(56, 34, 2);
      graphics.fillRect(39, 44, 18, 3);
    } else {
      graphics.fillStyle(accentColor, 1);
      graphics.fillTriangle(24, 54, 72, 54, 48, 16);
      graphics.fillStyle(0x182942, 0.92);
      graphics.fillRect(24, 64, 48, 42);
      graphics.fillStyle(0xffffff, 0.45);
      graphics.fillRect(31, 27, 34, 4);
      graphics.fillRect(38, 34, 20, 3);
    }

    graphics.generateTexture(key, 96, 128);
    graphics.destroy();
  }
}
