export type AssetPathId =
  | 'PIXEL'
  | 'TITLE_BG'
  | 'TITLE_LOGO'
  | 'UI_PANEL'
  | 'NINJA_BOY_IDLE'
  | 'NINJA_BOY_WALK'
  | 'NINJA_BOY_ATTACK'
  | 'NINJA_BLUE_BAT'
  | 'NINJA_NPC_VILLAGER5'
  | 'NINJA_TILESET_FIELD'
  | 'NINJA_TILESET_NATURE'
  | 'NINJA_TILESET_HOUSE'
  | 'NINJA_WATER_RIPPLES'
  | 'NINJA_AMBIENT_FLOWER'
  | 'NINJA_FLAG_RED'
  | 'NINJA_PARTICLE_LEAF'
  | 'NINJA_LANTERN_GREEN'
  | 'NINJA_GREEN_SLIME'
  | 'NINJA_MOUSE'
  | 'ITEM_CRATE'
  | 'ITEM_BAG';

export interface AssetManifestEntry {
  key: string;
  type: 'image';
  assetId: AssetPathId;
  fallbackAssetId?: AssetPathId;
  required: boolean;
}

export type TitleMenuAction = 'new_game' | 'load_game';

export interface TitleMenuEntry {
  id: string;
  label: string;
  action: TitleMenuAction;
}

export interface TitleStatusMessages {
  noSaveData: string;
  newGameReady: string;
  loadGameReady: string;
  characterCreationUnavailable: string;
  overworldUnavailable: string;
}

export interface TitleScreenConfig {
  gameTitle: string;
  subtitle: string;
  menu: TitleMenuEntry[];
  statusMessages: TitleStatusMessages;
}

