export interface AxisInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface OverworldBoundsLimits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface WorldPosition {
  x: number;
  y: number;
}

const normalizeDirection = (x: number, y: number): WorldPosition => {
  if (x === 0 && y === 0) {
    return { x: 0, y: 0 };
  }

  const magnitude = Math.hypot(x, y);
  return {
    x: x / magnitude,
    y: y / magnitude,
  };
};

export const readMovementDirection = (input: AxisInputState): WorldPosition => {
  const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  return normalizeDirection(axisX, axisY);
};

export const getMovedPosition = (
  current: WorldPosition,
  direction: WorldPosition,
  speedPixelsPerSecond: number,
  deltaMs: number,
  bounds: OverworldBoundsLimits,
): WorldPosition => {
  const step = speedPixelsPerSecond * (deltaMs / 1000);
  const nextX = current.x + direction.x * step;
  const nextY = current.y + direction.y * step;

  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, nextX)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, nextY)),
  };
};

export const isWithinDistance = (from: WorldPosition, to: WorldPosition, radius: number): boolean => {
  const dx = from.x - to.x;
  const dy = from.y - to.y;
  return dx * dx + dy * dy <= radius * radius;
};

export const isInsideRect = (position: WorldPosition, rect: { x: number; y: number; width: number; height: number }): boolean => {
  return (
    position.x >= rect.x &&
    position.x <= rect.x + rect.width &&
    position.y >= rect.y &&
    position.y <= rect.y + rect.height
  );
};
