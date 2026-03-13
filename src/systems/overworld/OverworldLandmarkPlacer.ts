import type { GridPoint } from '../../data/types/OverworldGeneration';
import type { OverworldAssetRegistry } from './OverworldAssetRegistry';
import { clearGridRect, forEachTileInRect, setGridValue, tileToWorldPoint, type TilePoint, type TileRect } from './OverworldGridHelpers';
import { OverworldSeededRandom } from './OverworldSeededRandom';
import { pickFromPalette } from './OverworldDecorationHelpers';

export interface LandmarkPlacementResult {
  landmarkArea: TileRect;
  flowerPoints: GridPoint[];
  lanternPoints: GridPoint[];
  flagPoints: GridPoint[];
}

interface PlaceLandmarkInput {
  width: number;
  height: number;
  tileSize: number;
  terrain: number[][];
  props: number[][];
  landmarkTile: TilePoint;
  registry: OverworldAssetRegistry;
  rng: OverworldSeededRandom;
}

const toWorld = (tileSize: number, x: number, y: number): GridPoint => {
  const point = tileToWorldPoint(x, y, tileSize);
  return { x: point.x, y: point.y };
};

export const placeOverworldLandmark = ({
  width,
  height,
  tileSize,
  terrain,
  props,
  landmarkTile,
  registry,
  rng,
}: PlaceLandmarkInput): LandmarkPlacementResult => {
  const landmarkArea: TileRect = {
    x: landmarkTile.x - 3,
    y: landmarkTile.y - 2,
    width: 7,
    height: 5,
  };

  forEachTileInRect(width, height, landmarkArea, (x, y) => {
    const ringX = Math.abs(x - landmarkTile.x);
    const ringY = Math.abs(y - landmarkTile.y);
    const edge = Math.max(ringX, ringY) >= 2;

    if (edge) {
      setGridValue(terrain, x, y, pickFromPalette(rng, registry.pathAccent));
    } else {
      setGridValue(terrain, x, y, pickFromPalette(rng, registry.pathStoneAccent));
    }
  });

  clearGridRect(props, width, height, landmarkArea);

  return {
    landmarkArea,
    flowerPoints: [toWorld(tileSize, landmarkTile.x - 3, landmarkTile.y), toWorld(tileSize, landmarkTile.x + 3, landmarkTile.y)],
    lanternPoints: [toWorld(tileSize, landmarkTile.x - 2, landmarkTile.y + 3), toWorld(tileSize, landmarkTile.x + 2, landmarkTile.y + 3)],
    flagPoints: [toWorld(tileSize, landmarkTile.x - 1, landmarkTile.y + 3), toWorld(tileSize, landmarkTile.x + 1, landmarkTile.y + 3)],
  };
};

