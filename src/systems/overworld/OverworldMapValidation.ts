import type { OverworldMapDefinition } from '../../data/types/Overworld';
import { logger } from '../../utils/logger';
import { clampTilePoint, worldToTilePoint, type TilePoint } from './OverworldGridHelpers';
import { isPathTile } from './OverworldDecorationHelpers';

interface ValidateAndRepairInput {
  pathMask: boolean[][];
  mapDefinition: OverworldMapDefinition;
  landmarkTile: TilePoint;
  exitTile: TilePoint;
  mapWidth: number;
  mapHeight: number;
  tileSize: number;
}

const findNearbyPathTile = (pathMask: boolean[][], center: TilePoint, radius: number): TilePoint | null => {
  for (let r = 0; r <= radius; r += 1) {
    for (let y = center.y - r; y <= center.y + r; y += 1) {
      for (let x = center.x - r; x <= center.x + r; x += 1) {
        if (isPathTile(pathMask, x, y)) {
          return { x, y };
        }
      }
    }
  }

  return null;
};

const breadthFirstSearch = (pathMask: boolean[][], start: TilePoint, goal: TilePoint): boolean => {
  const height = pathMask.length;
  const width = pathMask[0]?.length ?? 0;
  if (height <= 0 || width <= 0) {
    return false;
  }

  const queue: TilePoint[] = [start];
  const seen = new Set<string>([`${start.x},${start.y}`]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    if (current.x === goal.x && current.y === goal.y) {
      return true;
    }

    const neighbors: TilePoint[] = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ];

    for (const neighbor of neighbors) {
      if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= width || neighbor.y >= height) {
        continue;
      }

      if (!isPathTile(pathMask, neighbor.x, neighbor.y)) {
        continue;
      }

      const id = `${neighbor.x},${neighbor.y}`;
      if (seen.has(id)) {
        continue;
      }

      seen.add(id);
      queue.push(neighbor);
    }
  }

  return false;
};

const carveSimpleCorridor = (pathMask: boolean[][], from: TilePoint, to: TilePoint): void => {
  let currentX = from.x;
  let currentY = from.y;

  const carve = (x: number, y: number): void => {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const row = pathMask[y + dy];
        if (!row || row[x + dx] === undefined) {
          continue;
        }

        row[x + dx] = true;
      }
    }
  };

  while (currentX !== to.x) {
    carve(currentX, currentY);
    currentX += Math.sign(to.x - currentX);
  }

  while (currentY !== to.y) {
    carve(currentX, currentY);
    currentY += Math.sign(to.y - currentY);
  }

  carve(to.x, to.y);
};

export const validateAndRepairReadability = ({
  pathMask,
  mapDefinition,
  landmarkTile,
  exitTile,
  mapWidth,
  mapHeight,
  tileSize,
}: ValidateAndRepairInput): void => {
  const spawnTile = worldToTilePoint(mapDefinition.spawnPoint.x, mapDefinition.spawnPoint.y, tileSize);
  const npcTile = worldToTilePoint(mapDefinition.npc.x, mapDefinition.npc.y, tileSize);

  const start = findNearbyPathTile(pathMask, spawnTile, 4);
  const npcPathTile = findNearbyPathTile(pathMask, npcTile, 4);
  const landmarkPathTile = findNearbyPathTile(pathMask, landmarkTile, 4);
  const exitPathTile = findNearbyPathTile(pathMask, exitTile, 4);

  if (!start || !npcPathTile || !landmarkPathTile || !exitPathTile) {
    logger.warn('Overworld path validation failed for key locations. Applying simple route repair.');

    const clampedSpawn = clampTilePoint(mapWidth, mapHeight, spawnTile);
    const clampedNpc = clampTilePoint(mapWidth, mapHeight, npcTile);
    const clampedExit = clampTilePoint(mapWidth, mapHeight, exitTile);

    carveSimpleCorridor(pathMask, clampedSpawn, landmarkTile);
    carveSimpleCorridor(pathMask, landmarkTile, clampedNpc);
    carveSimpleCorridor(pathMask, clampedNpc, clampedExit);
    return;
  }

  const spawnToNpc = breadthFirstSearch(pathMask, start, npcPathTile);
  const spawnToLandmark = breadthFirstSearch(pathMask, start, landmarkPathTile);
  const spawnToExit = breadthFirstSearch(pathMask, start, exitPathTile);

  if (!spawnToNpc || !spawnToLandmark || !spawnToExit) {
    logger.warn('Overworld connectivity validation failed. Applying route repair corridor.');
    carveSimpleCorridor(pathMask, start, landmarkPathTile);
    carveSimpleCorridor(pathMask, landmarkPathTile, npcPathTile);
    carveSimpleCorridor(pathMask, npcPathTile, exitPathTile);
  }
};
