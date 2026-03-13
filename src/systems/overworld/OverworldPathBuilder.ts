import type { OverworldMapDefinition } from '../../data/types/Overworld';
import { clampTilePoint, createBooleanGrid, worldToTilePoint, type TilePoint, type TileRect } from './OverworldGridHelpers';
import { OverworldSeededRandom } from './OverworldSeededRandom';

export interface OverworldPathLayout {
  pathMask: boolean[][];
  routeNodes: TilePoint[];
  sideAreas: TileRect[];
  landmarkTile: TilePoint;
  exitTile: TilePoint;
}

interface BuildOverworldPathLayoutInput {
  width: number;
  height: number;
  tileSize: number;
  mapDefinition: OverworldMapDefinition;
  rng: OverworldSeededRandom;
}

const carveStamp = (pathMask: boolean[][], width: number, height: number, tileX: number, tileY: number, radius: number): void => {
  for (let y = tileY - radius; y <= tileY + radius; y += 1) {
    for (let x = tileX - radius; x <= tileX + radius; x += 1) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        continue;
      }

      const row = pathMask[y];
      if (!row) {
        continue;
      }

      row[x] = true;
    }
  }
};

const carveCorridor = (
  pathMask: boolean[][],
  width: number,
  height: number,
  from: TilePoint,
  to: TilePoint,
  pathWidth: number,
): void => {
  const radius = pathWidth <= 1 ? 0 : 1;
  let currentX = from.x;
  let currentY = from.y;

  while (currentY !== to.y) {
    carveStamp(pathMask, width, height, currentX, currentY, radius);
    currentY += Math.sign(to.y - currentY);
  }

  while (currentX !== to.x) {
    carveStamp(pathMask, width, height, currentX, currentY, radius);
    currentX += Math.sign(to.x - currentX);
  }

  carveStamp(pathMask, width, height, to.x, to.y, radius);
};

const createExitTile = (
  width: number,
  height: number,
  tileSize: number,
  mapDefinition: OverworldMapDefinition,
): TilePoint => {
  const zone = mapDefinition.encounterZone;
  if (!zone) {
    return { x: width - 4, y: Math.floor(height * 0.52) };
  }

  return clampTilePoint(width, height, {
    x: Math.floor((zone.x + zone.width / 2) / tileSize),
    y: Math.floor((zone.y + zone.height / 2) / tileSize),
  });
};

export const buildOverworldPathLayout = ({
  width,
  height,
  tileSize,
  mapDefinition,
  rng,
}: BuildOverworldPathLayoutInput): OverworldPathLayout => {
  const pathMask = createBooleanGrid(width, height, false);

  const spawnTile = clampTilePoint(width, height, worldToTilePoint(mapDefinition.spawnPoint.x, mapDefinition.spawnPoint.y, tileSize));
  const npcTile = clampTilePoint(width, height, worldToTilePoint(mapDefinition.npc.x, mapDefinition.npc.y, tileSize));
  const exitTile = createExitTile(width, height, tileSize, mapDefinition);

  const landmarkTile = clampTilePoint(width, height, {
    x: Math.floor(width * 0.5) + rng.int(-1, 1),
    y: Math.floor(height * 0.32),
  });

  const mainPathY = Math.max(6, Math.min(height - 6, Math.max(spawnTile.y, npcTile.y) - 1));
  const spawnMainTile = clampTilePoint(width, height, {
    x: spawnTile.x,
    y: mainPathY,
  });

  const forkTile = clampTilePoint(width, height, {
    x: Math.floor(width * 0.44),
    y: mainPathY,
  });

  const npcMainTile = clampTilePoint(width, height, {
    x: npcTile.x,
    y: mainPathY,
  });

  const exitMainTile = clampTilePoint(width, height, {
    x: exitTile.x,
    y: mainPathY,
  });

  // Clear east-west main route for readability.
  const routeNodes: TilePoint[] = [spawnTile, spawnMainTile, forkTile, npcMainTile, npcTile, exitMainTile, exitTile];

  for (let index = 0; index < routeNodes.length - 1; index += 1) {
    const from = routeNodes[index];
    const to = routeNodes[index + 1];
    if (!from || !to) {
      continue;
    }

    carveCorridor(pathMask, width, height, from, to, 2);
  }

  // Branch to the central landmark from the main route.
  carveCorridor(pathMask, width, height, forkTile, landmarkTile, 2);

  const sideAreas: TileRect[] = [
    { x: landmarkTile.x - 4, y: landmarkTile.y + 3, width: 8, height: 6 },
    { x: npcTile.x + 2, y: npcTile.y - 2, width: 7, height: 6 },
    { x: forkTile.x - 4, y: forkTile.y + 2, width: 7, height: 5 },
  ];

  return {
    pathMask,
    routeNodes,
    sideAreas,
    landmarkTile,
    exitTile,
  };
};


