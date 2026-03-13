export interface TilePoint {
  x: number;
  y: number;
}

export interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const createNumberGrid = (width: number, height: number, fillValue: number): number[][] => {
  const rows: number[][] = [];

  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      row.push(fillValue);
    }
    rows.push(row);
  }

  return rows;
};

export const createBooleanGrid = (width: number, height: number, fillValue: boolean): boolean[][] => {
  const rows: boolean[][] = [];

  for (let y = 0; y < height; y += 1) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x += 1) {
      row.push(fillValue);
    }
    rows.push(row);
  }

  return rows;
};

export const isInsideGrid = (width: number, height: number, x: number, y: number): boolean => {
  return x >= 0 && y >= 0 && x < width && y < height;
};

export const readGridValue = <T>(grid: T[][], x: number, y: number): T | undefined => {
  const row = grid[y];
  if (!row) {
    return undefined;
  }

  return row[x];
};

export const setGridValue = <T>(grid: T[][], x: number, y: number, value: T): void => {
  const row = grid[y];
  if (!row || row[x] === undefined) {
    return;
  }

  row[x] = value;
};

export const forEachTileInRect = (
  width: number,
  height: number,
  rect: TileRect,
  callback: (x: number, y: number) => void,
): void => {
  const startX = Math.max(0, Math.floor(rect.x));
  const startY = Math.max(0, Math.floor(rect.y));
  const endX = Math.min(width, Math.ceil(rect.x + rect.width));
  const endY = Math.min(height, Math.ceil(rect.y + rect.height));

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      callback(x, y);
    }
  }
};

export const clearGridRect = (grid: number[][], width: number, height: number, rect: TileRect): void => {
  forEachTileInRect(width, height, rect, (x, y) => {
    setGridValue(grid, x, y, -1);
  });
};

export const clampTilePoint = (width: number, height: number, point: TilePoint): TilePoint => {
  const maxX = Math.max(0, width - 1);
  const maxY = Math.max(0, height - 1);

  return {
    x: Math.max(0, Math.min(maxX, Math.floor(point.x))),
    y: Math.max(0, Math.min(maxY, Math.floor(point.y))),
  };
};

export const worldToTilePoint = (x: number, y: number, tileSize: number): TilePoint => {
  return {
    x: Math.floor(x / tileSize),
    y: Math.floor(y / tileSize),
  };
};

export const tileToWorldPoint = (tileX: number, tileY: number, tileSize: number): TilePoint => {
  return {
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
  };
};

export const rectCenterPoint = (rect: TileRect): TilePoint => {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
};

export const expandRect = (rect: TileRect, amount: number): TileRect => {
  return {
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
  };
};
