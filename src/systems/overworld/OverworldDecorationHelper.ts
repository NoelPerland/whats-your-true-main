import Phaser from 'phaser';

import { ASSET_KEYS } from '../../core/constants/assetKeys';
import type { OverworldMapDefinition } from '../../data/types/Overworld';

export interface OverworldDecorationHandle {
  destroy(): void;
}

interface DecorationAnchor {
  x: number;
  y: number;
  textureKey: string;
  scale: number;
  tint?: number;
}

const hasTexture = (scene: Phaser.Scene, key: string): boolean => {
  return scene.textures.exists(key);
};

class OverworldDecorationHelper implements OverworldDecorationHandle {
  private readonly objects: Phaser.GameObjects.Image[] = [];
  private readonly tweens: Phaser.Tweens.Tween[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    mapDefinition: OverworldMapDefinition,
    depthBase: number,
  ) {
    const anchors = this.createAnchors(mapDefinition);

    for (const anchor of anchors) {
      if (!hasTexture(scene, anchor.textureKey)) {
        continue;
      }

      const object = scene.add
        .image(anchor.x, anchor.y, anchor.textureKey)
        .setOrigin(0.5, 1)
        .setScale(anchor.scale)
        .setDepth(depthBase + anchor.y * 0.01 + 0.2);

      if (anchor.tint !== undefined) {
        object.setTint(anchor.tint);
      }

      const floatTween = scene.tweens.add({
        targets: object,
        y: anchor.y - 1.1,
        duration: 1800 + Math.floor(Math.random() * 900),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      this.objects.push(object);
      this.tweens.push(floatTween);
    }
  }

  destroy(): void {
    for (const tween of this.tweens) {
      tween.stop();
      tween.remove();
    }

    for (const object of this.objects) {
      object.destroy();
    }
  }

  private createAnchors(mapDefinition: OverworldMapDefinition): DecorationAnchor[] {
    const anchors: DecorationAnchor[] = [];

    anchors.push(
      {
        x: mapDefinition.npc.x - 28,
        y: mapDefinition.npc.y + 14,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.6,
      },
      {
        x: mapDefinition.npc.x + 20,
        y: mapDefinition.npc.y + 13,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.4,
        tint: 0xdcb88c,
      },
      {
        x: mapDefinition.spawnPoint.x + 26,
        y: mapDefinition.spawnPoint.y + 14,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.35,
        tint: 0xc9a572,
      },
    );

    const edgeLeftX = mapDefinition.bounds.x + 60;
    const edgeRightX = mapDefinition.bounds.x + mapDefinition.bounds.width - 72;
    const topY = mapDefinition.bounds.y + 96;
    const bottomY = mapDefinition.bounds.y + mapDefinition.bounds.height - 28;

    anchors.push(
      {
        x: edgeLeftX,
        y: topY,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.2,
        tint: 0xcfae81,
      },
      {
        x: edgeLeftX + 26,
        y: topY + 10,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.25,
      },
      {
        x: edgeRightX,
        y: topY + 18,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.32,
      },
      {
        x: edgeRightX - 24,
        y: topY + 10,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.15,
        tint: 0xd7b37f,
      },
      {
        x: edgeLeftX + 8,
        y: bottomY,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.24,
      },
      {
        x: edgeRightX - 18,
        y: bottomY - 4,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.2,
        tint: 0xd8b48b,
      },
    );

    const mapCenterX = mapDefinition.bounds.x + mapDefinition.bounds.width * 0.52;
    const mapCenterY = mapDefinition.bounds.y + mapDefinition.bounds.height * 0.28;

    anchors.push(
      {
        x: mapCenterX - 24,
        y: mapCenterY + 16,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.45,
      },
      {
        x: mapCenterX + 18,
        y: mapCenterY + 14,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_BAG,
        scale: 1.3,
        tint: 0xd9b27f,
      },
    );

    if (mapDefinition.encounterZone) {
      anchors.push({
        x: mapDefinition.encounterZone.x + 24,
        y: mapDefinition.encounterZone.y + mapDefinition.encounterZone.height - 8,
        textureKey: ASSET_KEYS.OVERWORLD_PROP_CRATE,
        scale: 1.42,
      });
    }

    return anchors;
  }
}

export const createOverworldDecorations = (
  scene: Phaser.Scene,
  mapDefinition: OverworldMapDefinition,
  depthBase: number,
): OverworldDecorationHandle => {
  return new OverworldDecorationHelper(scene, mapDefinition, depthBase);
};
