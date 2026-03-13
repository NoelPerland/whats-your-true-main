import Phaser from 'phaser';

import { ASSET_KEYS } from '../../core/constants/assetKeys';
import type { OverworldMapDefinition } from '../../data/types/Overworld';
import type { OverworldAmbientAnchorSet } from '../../data/types/OverworldGeneration';
import { logger } from '../../utils/logger';
import { generateStarterOverworldLayout } from './OverworldMapGenerator';
import { OVERWORLD_MAP_SIZE, type OverworldTilesetRefs } from './OverworldAssetRegistry';

export interface OverworldMapBuildResult {
  propsLayerDepth: number;
  characterLayerDepth: number;
  ambientAnchors: OverworldAmbientAnchorSet;
}

const addTilesets = (map: Phaser.Tilemaps.Tilemap): OverworldTilesetRefs | null => {
  const field = map.addTilesetImage(
    ASSET_KEYS.OVERWORLD_TILESET_FIELD,
    ASSET_KEYS.OVERWORLD_TILESET_FIELD,
    OVERWORLD_MAP_SIZE.tileSize,
    OVERWORLD_MAP_SIZE.tileSize,
    0,
    0,
    1,
  );
  if (!field) {
    return null;
  }

  const nature = map.addTilesetImage(
    ASSET_KEYS.OVERWORLD_TILESET_NATURE,
    ASSET_KEYS.OVERWORLD_TILESET_NATURE,
    OVERWORLD_MAP_SIZE.tileSize,
    OVERWORLD_MAP_SIZE.tileSize,
    0,
    0,
    field.firstgid + field.total,
  );
  if (!nature) {
    return null;
  }

  const house = map.addTilesetImage(
    ASSET_KEYS.OVERWORLD_TILESET_HOUSE,
    ASSET_KEYS.OVERWORLD_TILESET_HOUSE,
    OVERWORLD_MAP_SIZE.tileSize,
    OVERWORLD_MAP_SIZE.tileSize,
    0,
    0,
    nature.firstgid + nature.total,
  );

  if (!house) {
    return null;
  }

  return { field, nature, house };
};

const paintFallbackBackground = (scene: Phaser.Scene): void => {
  logger.warn('Overworld tileset setup failed. Using fallback painted background.');

  scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0x305f36, 1);
  scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width * 0.66, 72, 0xb28d54, 0.95);
};

const emptyAnchors = (): OverworldAmbientAnchorSet => {
  return {
    waterRipplePoints: [],
    flowerPoints: [],
    lanternPoints: [],
    flagPoints: [],
    leafArea: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  };
};

const applyGridToLayer = (layer: Phaser.Tilemaps.TilemapLayer, grid: number[][]): void => {
  for (let y = 0; y < grid.length; y += 1) {
    const row = grid[y];
    if (!row) {
      continue;
    }

    for (let x = 0; x < row.length; x += 1) {
      const gid = row[x];
      if (gid === undefined || gid < 0) {
        continue;
      }

      layer.putTileAt(gid, x, y);
    }
  }
};

export const buildStarterOverworldMap = (
  scene: Phaser.Scene,
  mapDefinition: OverworldMapDefinition,
): OverworldMapBuildResult => {
  const map = scene.make.tilemap({
    tileWidth: OVERWORLD_MAP_SIZE.tileSize,
    tileHeight: OVERWORLD_MAP_SIZE.tileSize,
    width: OVERWORLD_MAP_SIZE.widthTiles,
    height: OVERWORLD_MAP_SIZE.heightTiles,
  });

  const tilesets = addTilesets(map);
  if (!tilesets) {
    paintFallbackBackground(scene);
    return {
      propsLayerDepth: 20,
      characterLayerDepth: 30,
      ambientAnchors: emptyAnchors(),
    };
  }

  const layers = [tilesets.field, tilesets.nature, tilesets.house];
  const groundLayer = map.createBlankLayer('ground', layers, 0, 0);
  const terrainLayer = map.createBlankLayer('terrain', layers, 0, 0);
  const propsLayer = map.createBlankLayer('props', layers, 0, 0);

  if (!groundLayer || !terrainLayer || !propsLayer) {
    paintFallbackBackground(scene);
    return {
      propsLayerDepth: 20,
      characterLayerDepth: 30,
      ambientAnchors: emptyAnchors(),
    };
  }

  groundLayer.setDepth(0);
  terrainLayer.setDepth(10);
  propsLayer.setDepth(20);

  const generatedLayout = generateStarterOverworldLayout({
    mapDefinition,
    tilesets,
  });

  applyGridToLayer(groundLayer, generatedLayout.ground);
  applyGridToLayer(terrainLayer, generatedLayout.terrain);
  applyGridToLayer(propsLayer, generatedLayout.props);

  return {
    propsLayerDepth: propsLayer.depth,
    characterLayerDepth: propsLayer.depth + 10,
    ambientAnchors: generatedLayout.ambientAnchors,
  };
};
