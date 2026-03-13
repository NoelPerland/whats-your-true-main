import type { OverworldMapDefinition } from '../../data/types/Overworld';
import type { GeneratedOverworldLayout, GridPoint, OverworldAmbientAnchorSet } from '../../data/types/OverworldGeneration';
import { createOverworldAssetRegistry, OVERWORLD_MAP_SIZE, type OverworldTilesetRefs } from './OverworldAssetRegistry';
import { fillBaseBiome, paintMainRoute } from './OverworldBiomePainter';
import { decorateOverworldMap } from './OverworldDecorationSystem';
import { createNumberGrid, tileToWorldPoint, worldToTilePoint } from './OverworldGridHelpers';
import { placeOverworldLandmark } from './OverworldLandmarkPlacer';
import { buildOverworldPathLayout } from './OverworldPathBuilder';
import { createSeedFromString, OverworldSeededRandom } from './OverworldSeededRandom';
import { validateAndRepairReadability } from './OverworldMapValidation';

interface GenerateOverworldMapInput {
  mapDefinition: OverworldMapDefinition;
  tilesets: OverworldTilesetRefs;
  seed?: number;
}

const mergeAnchors = (
  landmarkFlowerPoints: GridPoint[],
  decorationFlowerPoints: GridPoint[],
  landmarkLanternPoints: GridPoint[],
  landmarkFlagPoints: GridPoint[],
  waterRipplePoints: GridPoint[],
  leafArea: { x: number; y: number; width: number; height: number },
): OverworldAmbientAnchorSet => {
  return {
    waterRipplePoints,
    flowerPoints: [...landmarkFlowerPoints, ...decorationFlowerPoints],
    lanternPoints: landmarkLanternPoints,
    flagPoints: landmarkFlagPoints,
    leafArea,
  };
};

const createNpcFlowerAnchor = (mapDefinition: OverworldMapDefinition): GridPoint => {
  const npcTile = worldToTilePoint(mapDefinition.npc.x, mapDefinition.npc.y, OVERWORLD_MAP_SIZE.tileSize);
  const point = tileToWorldPoint(npcTile.x + 1, npcTile.y - 1, OVERWORLD_MAP_SIZE.tileSize);

  return { x: point.x, y: point.y };
};

export const generateStarterOverworldLayout = ({
  mapDefinition,
  tilesets,
  seed,
}: GenerateOverworldMapInput): GeneratedOverworldLayout => {
  const width = OVERWORLD_MAP_SIZE.widthTiles;
  const height = OVERWORLD_MAP_SIZE.heightTiles;
  const tileSize = OVERWORLD_MAP_SIZE.tileSize;

  const baseSeed = seed ?? createSeedFromString(mapDefinition.mapId);
  const rng = new OverworldSeededRandom(baseSeed);
  const registry = createOverworldAssetRegistry(tilesets);

  const ground = createNumberGrid(width, height, -1);
  const terrain = createNumberGrid(width, height, -1);
  const props = createNumberGrid(width, height, -1);

  fillBaseBiome(ground, terrain, width, height, rng, registry);

  const pathLayout = buildOverworldPathLayout({
    width,
    height,
    tileSize,
    mapDefinition,
    rng,
  });

  validateAndRepairReadability({
    pathMask: pathLayout.pathMask,
    mapDefinition,
    landmarkTile: pathLayout.landmarkTile,
    exitTile: pathLayout.exitTile,
    mapWidth: width,
    mapHeight: height,
    tileSize,
  });

  paintMainRoute(terrain, pathLayout.pathMask, width, height, rng, registry);

  const landmark = placeOverworldLandmark({
    width,
    height,
    tileSize,
    terrain,
    props,
    landmarkTile: pathLayout.landmarkTile,
    registry,
    rng,
  });

  const decoration = decorateOverworldMap({
    width,
    height,
    tileSize,
    mapDefinition,
    terrain,
    props,
    pathMask: pathLayout.pathMask,
    sideAreas: pathLayout.sideAreas,
    landmarkArea: landmark.landmarkArea,
    registry,
    rng,
  });

  const ambientAnchors = mergeAnchors(
    landmark.flowerPoints,
    [...decoration.flowerPoints, createNpcFlowerAnchor(mapDefinition)],
    landmark.lanternPoints,
    landmark.flagPoints,
    decoration.waterRipplePoints,
    decoration.leafArea,
  );

  return {
    width,
    height,
    ground,
    terrain,
    props,
    ambientAnchors,
  };
};
