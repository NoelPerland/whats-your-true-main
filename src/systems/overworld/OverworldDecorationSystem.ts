import type { OverworldMapDefinition } from '../../data/types/Overworld';
import type { GridPoint, GridRect } from '../../data/types/OverworldGeneration';
import type { OverworldAssetRegistry } from './OverworldAssetRegistry';
import { setGridValue, tileToWorldPoint, worldToTilePoint, type TileRect } from './OverworldGridHelpers';
import { OverworldSeededRandom } from './OverworldSeededRandom';
import { isPathTile, pickFromPalette } from './OverworldDecorationHelpers';

interface DecorationInput {
  width: number;
  height: number;
  tileSize: number;
  mapDefinition: OverworldMapDefinition;
  terrain: number[][];
  props: number[][];
  pathMask: boolean[][];
  sideAreas: TileRect[];
  landmarkArea: TileRect;
  registry: OverworldAssetRegistry;
  rng: OverworldSeededRandom;
}

export interface DecorationResult {
  flowerPoints: GridPoint[];
  waterRipplePoints: GridPoint[];
  leafArea: GridRect;
}

const decoratePathShoulders = (
  width: number,
  height: number,
  terrain: number[][],
  pathMask: boolean[][],
  registry: OverworldAssetRegistry,
  rng: OverworldSeededRandom,
): void => {
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      if (isPathTile(pathMask, x, y)) {
        continue;
      }

      const nearPath =
        isPathTile(pathMask, x - 1, y) ||
        isPathTile(pathMask, x + 1, y) ||
        isPathTile(pathMask, x, y - 1) ||
        isPathTile(pathMask, x, y + 1);

      if (nearPath && rng.chance(0.1)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, registry.groundWornAccent));
      }
    }
  }
};

const paintNaturalBorders = (
  width: number,
  height: number,
  terrain: number[][],
  registry: OverworldAssetRegistry,
  rng: OverworldSeededRandom,
): void => {
  const borderThickness = 3;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const edgeDistance = Math.min(x, y, width - 1 - x, height - 1 - y);
      if (edgeDistance > borderThickness) {
        continue;
      }

      const chance = edgeDistance === 0 ? 0.88 : edgeDistance === 1 ? 0.58 : 0.3;
      if (rng.chance(chance)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, registry.groundWornAccent));
      }
    }
  }
};

const decorateEncounterTerrain = (
  mapDefinition: OverworldMapDefinition,
  tileSize: number,
  terrain: number[][],
  registry: OverworldAssetRegistry,
  rng: OverworldSeededRandom,
): GridPoint[] => {
  const zone = mapDefinition.encounterZone;
  if (!zone) {
    return [];
  }

  const zoneX = Math.floor(zone.x / tileSize);
  const zoneY = Math.floor(zone.y / tileSize);
  const zoneWidth = Math.max(2, Math.floor(zone.width / tileSize));
  const zoneHeight = Math.max(2, Math.floor(zone.height / tileSize));

  for (let y = zoneY; y < zoneY + zoneHeight; y += 1) {
    for (let x = zoneX; x < zoneX + zoneWidth; x += 1) {
      if (rng.chance(0.22)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, registry.groundWornAccent));
      }
    }
  }

  const centerX = zoneX + Math.floor(zoneWidth / 2);
  const centerY = zoneY + Math.floor(zoneHeight / 2);

  return [
    tileToWorldPoint(centerX - 1, centerY, tileSize),
    tileToWorldPoint(centerX + 1, centerY + 1, tileSize),
  ].map((point) => ({ x: point.x, y: point.y }));
};

const clearPropsLayer = (props: number[][]): void => {
  for (let y = 0; y < props.length; y += 1) {
    const row = props[y];
    if (!row) {
      continue;
    }

    for (let x = 0; x < row.length; x += 1) {
      row[x] = -1;
    }
  }
};

const toWorldPointsFromAreas = (areas: readonly TileRect[], tileSize: number): GridPoint[] => {
  return areas.map((area) => {
    const centerX = area.x + Math.floor(area.width / 2);
    const centerY = area.y + Math.floor(area.height / 2);
    const point = tileToWorldPoint(centerX, centerY, tileSize);
    return { x: point.x, y: point.y };
  });
};

const npcAmbientPoint = (mapDefinition: OverworldMapDefinition, tileSize: number): GridPoint => {
  const tile = worldToTilePoint(mapDefinition.npc.x, mapDefinition.npc.y, tileSize);
  const point = tileToWorldPoint(tile.x - 1, tile.y - 1, tileSize);
  return { x: point.x, y: point.y };
};

export const decorateOverworldMap = ({
  width,
  height,
  tileSize,
  mapDefinition,
  terrain,
  props,
  pathMask,
  sideAreas,
  registry,
  rng,
}: DecorationInput): DecorationResult => {
  paintNaturalBorders(width, height, terrain, registry, rng);
  decoratePathShoulders(width, height, terrain, pathMask, registry, rng);
  const waterRipplePoints = decorateEncounterTerrain(mapDefinition, tileSize, terrain, registry, rng);
  clearPropsLayer(props);

  const flowerPoints = [
    ...toWorldPointsFromAreas(sideAreas, tileSize),
    npcAmbientPoint(mapDefinition, tileSize),
    { x: tileSize * 16, y: tileSize * 10 },
    { x: tileSize * 22, y: tileSize * 9 },
    { x: tileSize * 30, y: tileSize * 11 },
    { x: tileSize * 42, y: tileSize * 14 },
    { x: tileSize * 48, y: tileSize * 10 },
  ];

  return {
    flowerPoints,
    waterRipplePoints,
    leafArea: {
      x: tileSize * 6,
      y: tileSize * 2,
      width: tileSize * (width - 12),
      height: tileSize * 8,
    },
  };
};

