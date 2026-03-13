export class OverworldSeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(minInclusive: number, maxInclusive: number): number {
    if (maxInclusive <= minInclusive) {
      return minInclusive;
    }

    const range = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(this.next() * range);
  }

  chance(probability: number): boolean {
    if (probability <= 0) {
      return false;
    }

    if (probability >= 1) {
      return true;
    }

    return this.next() < probability;
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) {
      throw new Error('Cannot pick from an empty list.');
    }

    const index = this.int(0, values.length - 1);
    return values[index] as T;
  }
}

export const createSeedFromString = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};
