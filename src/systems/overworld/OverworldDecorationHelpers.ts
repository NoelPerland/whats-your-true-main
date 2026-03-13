import type { OverworldSeededRandom } from './OverworldSeededRandom';
import { setGridValue, type TileRect } from './OverworldGridHelpers';

export const pickFromPalette = (rng: OverworldSeededRandom, palette: readonly number[]): number => {
  if (palette.length === 0) {
    return -1;
  }

  return rng.pick(palette);
};

export const isInsideRect = (x: number, y: number, rect: TileRect): boolean => {
  return x >= rect.x && y >= rect.y && x < rect.x + rect.width && y < rect.y + rect.height;
};

export const isPathTile = (pathMask: boolean[][], x: number, y: number): boolean => {
  const row = pathMask[y];
  if (!row) {
    return false;
  }

  return row[x] === true;
};

export const isRestrictedTile = (x: number, y: number, pathMask: boolean[][], reservedAreas: readonly TileRect[]): boolean => {
  if (isPathTile(pathMask, x, y)) {
    return true;
  }

  return reservedAreas.some((rect) => isInsideRect(x, y, rect));
};

export const placePattern = (
  props: number[][],
  width: number,
  height: number,
  x: number,
  y: number,
  pattern: readonly number[][],
): void => {
  for (let row = 0; row < pattern.length; row += 1) {
    const patternRow = pattern[row];
    if (!patternRow) {
      continue;
    }

    for (let col = 0; col < patternRow.length; col += 1) {
      const gid = patternRow[col];
      if (gid === undefined || gid < 0) {
        continue;
      }

      const tileX = x + col;
      const tileY = y + row;
      if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= height) {
        continue;
      }

      setGridValue(props, tileX, tileY, gid);
    }
  }
};

export const placeCluster = (
  props: number[][],
  width: number,
  height: number,
  center: { x: number; y: number },
  radius: number,
  palette: readonly number[],
  density: number,
  rng: OverworldSeededRandom,
  pathMask: boolean[][],
  reservedAreas: readonly TileRect[],
): void => {
  for (let y = center.y - radius; y <= center.y + radius; y += 1) {
    for (let x = center.x - radius; x <= center.x + radius; x += 1) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        continue;
      }

      if (isRestrictedTile(x, y, pathMask, reservedAreas)) {
        continue;
      }

      const dx = x - center.x;
      const dy = y - center.y;
      const distanceFactor = Math.max(0, 1 - Math.hypot(dx, dy) / Math.max(1, radius));
      const chance = density * distanceFactor;

      if (!rng.chance(chance)) {
        continue;
      }

      setGridValue(props, x, y, pickFromPalette(rng, palette));
    }
  }
};
