import Phaser from 'phaser';

export const OVERWORLD_MAP_SIZE = {
  tileSize: 16,
  widthTiles: 60,
  heightTiles: 34,
} as const;

export interface OverworldTilesetRefs {
  field: Phaser.Tilemaps.Tileset;
  nature: Phaser.Tilemaps.Tileset;
  house: Phaser.Tilemaps.Tileset;
}

export interface OverworldAssetRegistry {
  groundGrassBase: number[];
  groundGrassVariation: number[];
  groundWornAccent: number[];
  pathBase: number[];
  pathAccent: number[];
  pathStoneAccent: number[];
  shrubs: number[];
  flowers: number[];
  rocks: number[];
  stumps: number[];
  logs: number[];
  grassTufts: number[];
  treeCanopyPattern: number[][];
}

const toGid = (tileset: Phaser.Tilemaps.Tileset, localTileIndex: number): number => {
  return tileset.firstgid + localTileIndex;
};

const toPalette = (tileset: Phaser.Tilemaps.Tileset, localTileIndexes: readonly number[]): number[] => {
  return localTileIndexes.map((index) => toGid(tileset, index));
};

export const createOverworldAssetRegistry = (tilesets: OverworldTilesetRefs): OverworldAssetRegistry => {
  return {
    // Conservative, known-safe tiles from the field tileset only.
    groundGrassBase: toPalette(tilesets.field, [18]),
    groundGrassVariation: toPalette(tilesets.field, [19, 23, 24]),
    groundWornAccent: toPalette(tilesets.field, [21, 22]),
    pathBase: toPalette(tilesets.field, [4]),
    // Use one gravel family for clean readability and avoid noisy white patches.
    pathAccent: toPalette(tilesets.field, [4]),
    pathStoneAccent: toPalette(tilesets.field, [4]),

    // Tile props are intentionally disabled until all IDs are fully curated.
    shrubs: [],
    flowers: [],
    rocks: [],
    stumps: [],
    logs: [],
    grassTufts: [],
    treeCanopyPattern: [],
  };
};

