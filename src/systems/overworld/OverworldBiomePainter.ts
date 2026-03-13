import type { OverworldAssetRegistry } from './OverworldAssetRegistry';
import { setGridValue } from './OverworldGridHelpers';
import { isPathTile, pickFromPalette } from './OverworldDecorationHelpers';
import { OverworldSeededRandom } from './OverworldSeededRandom';

export const fillBaseBiome = (
  ground: number[][],
  terrain: number[][],
  width: number,
  height: number,
  rng: OverworldSeededRandom,
  palettes: OverworldAssetRegistry,
): void => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      setGridValue(ground, x, y, pickFromPalette(rng, palettes.groundGrassBase));

      if (rng.chance(0.16)) {
        setGridValue(ground, x, y, pickFromPalette(rng, palettes.groundGrassVariation));
      }

      if (rng.chance(0.02)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, palettes.groundWornAccent));
      }
    }
  }
};

const countPathNeighbors = (pathMask: boolean[][], x: number, y: number): number => {
  let count = 0;

  if (pathMask[y - 1]?.[x]) {
    count += 1;
  }
  if (pathMask[y]?.[x - 1]) {
    count += 1;
  }
  if (pathMask[y]?.[x + 1]) {
    count += 1;
  }
  if (pathMask[y + 1]?.[x]) {
    count += 1;
  }

  return count;
};

export const paintMainRoute = (
  terrain: number[][],
  pathMask: boolean[][],
  width: number,
  height: number,
  rng: OverworldSeededRandom,
  palettes: OverworldAssetRegistry,
): void => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isPathTile(pathMask, x, y)) {
        continue;
      }

      const neighbors = countPathNeighbors(pathMask, x, y);
      if (neighbors >= 3 && rng.chance(0.22)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, palettes.pathStoneAccent));
      } else if (rng.chance(0.14)) {
        setGridValue(terrain, x, y, pickFromPalette(rng, palettes.pathAccent));
      } else {
        setGridValue(terrain, x, y, pickFromPalette(rng, palettes.pathBase));
      }
    }
  }
};
