import starterMapJson from '../../content/overworld/starterMap.json';
import type {
  OverworldBounds,
  OverworldEncounterZone,
  OverworldMapDefinition,
  OverworldNpcDefinition,
  OverworldSpawnPoint,
} from '../../data/types/Overworld';
import { logger } from '../../utils/logger';

const FALLBACK_MAP: OverworldMapDefinition = {
  mapId: 'starter_town',
  bounds: {
    x: 24,
    y: 24,
    width: 912,
    height: 492,
  },
  spawnPoint: {
    id: 'town_square',
    x: 336,
    y: 352,
    label: 'Village Plaza',
  },
  npc: {
    id: 'npc_guide',
    name: 'Village Guide',
    x: 688,
    y: 288,
    interactionRadius: 80,
    dialogueLines: [
      'Welcome to Embertrail Village, traveler.',
      'Follow the eastern path when you are ready for your first skirmish.',
    ],
  },
  encounterZone: {
    id: 'east_wilds_edge',
    x: 760,
    y: 112,
    width: 152,
    height: 288,
    label: 'Wild Route',
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const parseBounds = (value: unknown): OverworldBounds | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { x, y, width, height } = value;
  if (!isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height)) {
    return null;
  }

  return { x, y, width, height };
};

const parseSpawnPoint = (value: unknown): OverworldSpawnPoint | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, x, y, label } = value;
  if (typeof id !== 'string' || !isNumber(x) || !isNumber(y) || typeof label !== 'string') {
    return null;
  }

  return { id, x, y, label };
};

const parseNpc = (value: unknown): OverworldNpcDefinition | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, name, x, y, interactionRadius, dialogueLines } = value;
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    !isNumber(x) ||
    !isNumber(y) ||
    !isNumber(interactionRadius) ||
    !Array.isArray(dialogueLines) ||
    !dialogueLines.every((line) => typeof line === 'string')
  ) {
    return null;
  }

  if (dialogueLines.length === 0) {
    return null;
  }

  return {
    id,
    name,
    x,
    y,
    interactionRadius,
    dialogueLines,
  };
};

const parseEncounterZone = (value: unknown): OverworldEncounterZone | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, x, y, width, height, label } = value;
  if (
    typeof id !== 'string' ||
    !isNumber(x) ||
    !isNumber(y) ||
    !isNumber(width) ||
    !isNumber(height) ||
    typeof label !== 'string'
  ) {
    return null;
  }

  return {
    id,
    x,
    y,
    width,
    height,
    label,
  };
};

const parseMapDefinition = (value: unknown): OverworldMapDefinition | null => {
  if (!isRecord(value)) {
    return null;
  }

  const mapId = value.mapId;
  const bounds = parseBounds(value.bounds);
  const spawnPoint = parseSpawnPoint(value.spawnPoint);
  const npc = parseNpc(value.npc);
  let encounterZone: OverworldEncounterZone | undefined;
  if (value.encounterZone !== undefined) {
    const parsedEncounterZone = parseEncounterZone(value.encounterZone);
    if (!parsedEncounterZone) {
      return null;
    }

    encounterZone = parsedEncounterZone;
  }

  if (typeof mapId !== 'string' || !bounds || !spawnPoint || !npc) {
    return null;
  }

  return {
    mapId,
    bounds,
    spawnPoint,
    npc,
    encounterZone,
  };
};

export class OverworldContentLoader {
  static getStarterMap(): OverworldMapDefinition {
    const parsed = parseMapDefinition(starterMapJson as unknown);
    if (!parsed) {
      logger.warn('Overworld map content is invalid. Using fallback map.');
      return cloneValue(FALLBACK_MAP);
    }

    return cloneValue(parsed);
  }
}
