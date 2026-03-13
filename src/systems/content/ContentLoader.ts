import assetManifestJson from '../../content/bootstrap/assetManifest.json';
import defaultSessionJson from '../../content/bootstrap/defaultSession.json';
import titleScreenJson from '../../content/ui/titleScreen.json';
import { ASSET_KEYS } from '../../core/constants/assetKeys';
import type { GameSession } from '../../data/types/GameSession';
import type {
  AssetManifestEntry,
  AssetPathId,
  TitleMenuAction,
  TitleScreenConfig,
  TitleStatusMessages,
} from '../../data/types/Content';
import { logger } from '../../utils/logger';

const ASSET_PATH_IDS: readonly AssetPathId[] = [
  'PIXEL',
  'TITLE_BG',
  'TITLE_LOGO',
  'UI_PANEL',
  'NINJA_BOY_IDLE',
  'NINJA_BOY_WALK',
  'NINJA_BOY_ATTACK',
  'NINJA_BLUE_BAT',
  'NINJA_NPC_VILLAGER5',
  'NINJA_TILESET_FIELD',
  'NINJA_TILESET_NATURE',
  'NINJA_TILESET_HOUSE',
  'NINJA_WATER_RIPPLES',
  'NINJA_AMBIENT_FLOWER',
  'NINJA_FLAG_RED',
  'NINJA_PARTICLE_LEAF',
  'NINJA_LANTERN_GREEN',
];
const TITLE_MENU_ACTIONS: readonly TitleMenuAction[] = ['new_game', 'load_game'];

const FALLBACK_ASSET_MANIFEST: AssetManifestEntry[] = [
  {
    key: ASSET_KEYS.PIXEL,
    type: 'image',
    assetId: 'PIXEL',
    required: true,
  },
  {
    key: ASSET_KEYS.TITLE_BG,
    type: 'image',
    assetId: 'TITLE_BG',
    fallbackAssetId: 'PIXEL',
    required: true,
  },
  {
    key: ASSET_KEYS.TITLE_LOGO,
    type: 'image',
    assetId: 'TITLE_LOGO',
    fallbackAssetId: 'PIXEL',
    required: true,
  },
  {
    key: ASSET_KEYS.UI_PANEL,
    type: 'image',
    assetId: 'UI_PANEL',
    fallbackAssetId: 'PIXEL',
    required: true,
  },
];

const FALLBACK_TITLE_CONFIG: TitleScreenConfig = {
  gameTitle: 'Untitled 2D JRPG',
  subtitle: 'Starter Bootstrap Build',
  menu: [
    { id: 'new_game', label: 'New Game', action: 'new_game' },
    { id: 'load_game', label: 'Load Game', action: 'load_game' },
  ],
  statusMessages: {
    noSaveData: 'No save data found.',
    newGameReady: 'New game session seeded.',
    loadGameReady: 'Save loaded successfully.',
    characterCreationUnavailable: 'Character creation scene is not available yet.',
    overworldUnavailable: 'Overworld scene is not available yet.',
  },
};

const FALLBACK_DEFAULT_SESSION: GameSession = {
  version: 1,
  createdAt: '1970-01-01T00:00:00.000Z',
  updatedAt: '1970-01-01T00:00:00.000Z',
  playerProfile: null,
  party: [],
  inventory: { items: [] },
  equipment: { equippedByMemberId: {} },
  quests: [],
  flags: {},
  mapState: { mapId: 'starter_town', spawnPointId: 'town_square' },
  progression: { chapter: 0, storyStep: 'intro' },
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

const parseAssetPathId = (value: unknown): AssetPathId | null => {
  if (typeof value !== 'string') {
    return null;
  }

  return ASSET_PATH_IDS.includes(value as AssetPathId) ? (value as AssetPathId) : null;
};

const parseAssetManifestEntry = (value: unknown): AssetManifestEntry | null => {
  if (!isRecord(value)) {
    return null;
  }

  const key = value.key;
  const type = value.type;
  const assetId = parseAssetPathId(value.assetId);
  let fallbackAssetId: AssetPathId | undefined;
  if (value.fallbackAssetId !== undefined) {
    const parsedFallbackId = parseAssetPathId(value.fallbackAssetId);
    if (!parsedFallbackId) {
      return null;
    }

    fallbackAssetId = parsedFallbackId;
  }
  const required = value.required;

  if (typeof key !== 'string') {
    return null;
  }

  if (type !== 'image') {
    return null;
  }

  if (!assetId) {
    return null;
  }

  if (typeof required !== 'boolean') {
    return null;
  }

  return {
    key,
    type,
    assetId,
    fallbackAssetId,
    required,
  };
};

const parseTitleStatusMessages = (value: unknown): TitleStatusMessages | null => {
  if (!isRecord(value)) {
    return null;
  }

  const {
    noSaveData,
    newGameReady,
    loadGameReady,
    characterCreationUnavailable,
    overworldUnavailable,
  } = value;

  if (
    typeof noSaveData !== 'string' ||
    typeof newGameReady !== 'string' ||
    typeof loadGameReady !== 'string' ||
    typeof characterCreationUnavailable !== 'string' ||
    typeof overworldUnavailable !== 'string'
  ) {
    return null;
  }

  return {
    noSaveData,
    newGameReady,
    loadGameReady,
    characterCreationUnavailable,
    overworldUnavailable,
  };
};

const parseTitleMenuAction = (value: unknown): TitleMenuAction | null => {
  if (typeof value !== 'string') {
    return null;
  }

  return TITLE_MENU_ACTIONS.includes(value as TitleMenuAction) ? (value as TitleMenuAction) : null;
};

const parseTitleMenuEntry = (value: unknown): { id: string; label: string; action: TitleMenuAction } | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const label = value.label;
  const action = parseTitleMenuAction(value.action);

  if (typeof id !== 'string' || typeof label !== 'string' || !action) {
    return null;
  }

  return { id, label, action };
};

const parseTitleScreenConfig = (value: unknown): TitleScreenConfig | null => {
  if (!isRecord(value)) {
    return null;
  }

  const gameTitle = value.gameTitle;
  const subtitle = value.subtitle;
  const rawMenu = value.menu;
  const statusMessages = parseTitleStatusMessages(value.statusMessages);

  if (typeof gameTitle !== 'string' || typeof subtitle !== 'string' || !Array.isArray(rawMenu) || !statusMessages) {
    return null;
  }

  const parsedMenu = rawMenu
    .map((entry) => parseTitleMenuEntry(entry))
    .filter((entry): entry is { id: string; label: string; action: TitleMenuAction } => entry !== null);

  if (parsedMenu.length === 0) {
    return null;
  }

  return {
    gameTitle,
    subtitle,
    menu: parsedMenu,
    statusMessages,
  };
};

const isGameSessionShape = (value: unknown): value is GameSession => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.version === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    (value.playerProfile === null || isRecord(value.playerProfile)) &&
    Array.isArray(value.party) &&
    isRecord(value.inventory) &&
    isRecord(value.equipment) &&
    Array.isArray(value.quests) &&
    isRecord(value.flags) &&
    isRecord(value.mapState) &&
    isRecord(value.progression)
  );
};

export class ContentLoader {
  static getAssetManifest(): AssetManifestEntry[] {
    const rawManifest: unknown = assetManifestJson;
    if (!Array.isArray(rawManifest)) {
      logger.warn('Asset manifest is invalid. Using fallback manifest.');
      return cloneValue(FALLBACK_ASSET_MANIFEST);
    }

    const parsed = rawManifest
      .map((entry) => parseAssetManifestEntry(entry))
      .filter((entry): entry is AssetManifestEntry => entry !== null);

    if (parsed.length === 0) {
      logger.warn('Asset manifest has no valid entries. Using fallback manifest.');
      return cloneValue(FALLBACK_ASSET_MANIFEST);
    }

    return cloneValue(parsed);
  }

  static getTitleScreenConfig(): TitleScreenConfig {
    const parsed = parseTitleScreenConfig(titleScreenJson as unknown);
    if (!parsed) {
      logger.warn('Title screen content is invalid. Using fallback config.');
      return cloneValue(FALLBACK_TITLE_CONFIG);
    }

    return cloneValue(parsed);
  }

  static getDefaultSessionTemplate(): GameSession {
    const rawSession: unknown = defaultSessionJson;
    if (!isGameSessionShape(rawSession)) {
      logger.warn('Default session content is invalid. Using fallback session.');
      return cloneValue(FALLBACK_DEFAULT_SESSION);
    }

    return cloneValue(rawSession);
  }
}
