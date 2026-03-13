import { ASSET_KEYS } from '../core/constants/assetKeys';
import type { AssetPathId } from '../data/types/Content';

export interface SelectedSpritesheetAsset {
  key: string;
  assetId: AssetPathId;
  frameWidth: number;
  frameHeight: number;
  required: boolean;
}

export interface SelectedImageAsset {
  key: string;
  assetId: AssetPathId;
  required: boolean;
}

export const SELECTED_NINJA_SPRITESHEET_ASSETS: readonly SelectedSpritesheetAsset[] = [
  {
    key: ASSET_KEYS.OVERWORLD_PLAYER_IDLE_SHEET,
    assetId: 'NINJA_BOY_IDLE',
    frameWidth: 16,
    frameHeight: 16,
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET,
    assetId: 'NINJA_BOY_WALK',
    frameWidth: 16,
    frameHeight: 16,
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_PLAYER_ATTACK_SHEET,
    assetId: 'NINJA_BOY_ATTACK',
    frameWidth: 16,
    frameHeight: 16,
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_NPC_GUIDE_SHEET,
    assetId: 'NINJA_NPC_VILLAGER5',
    frameWidth: 16,
    frameHeight: 16,
    required: true,
  },
  {
    key: ASSET_KEYS.BATTLE_ENEMY_BLUE_BAT_SHEET,
    assetId: 'NINJA_BLUE_BAT',
    frameWidth: 16,
    frameHeight: 16,
    required: true,
  },
  {
    key: ASSET_KEYS.BATTLE_ENEMY_GREEN_SLIME_SHEET,
    assetId: 'NINJA_GREEN_SLIME',
    frameWidth: 64,
    frameHeight: 64,
    required: true,
  },
  {
    key: ASSET_KEYS.BATTLE_ENEMY_MOUSE_SHEET,
    assetId: 'NINJA_MOUSE',
    frameWidth: 16,
    frameHeight: 16,
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_AMBIENT_WATER_RIPPLES_SHEET,
    assetId: 'NINJA_WATER_RIPPLES',
    frameWidth: 16,
    frameHeight: 16,
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_AMBIENT_FLOWER_SHEET,
    assetId: 'NINJA_AMBIENT_FLOWER',
    frameWidth: 16,
    frameHeight: 16,
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_AMBIENT_FLAG_RED_SHEET,
    assetId: 'NINJA_FLAG_RED',
    frameWidth: 16,
    frameHeight: 16,
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_AMBIENT_LEAF_PARTICLE_SHEET,
    assetId: 'NINJA_PARTICLE_LEAF',
    frameWidth: 12,
    frameHeight: 7,
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_AMBIENT_LANTERN_SHEET,
    assetId: 'NINJA_LANTERN_GREEN',
    frameWidth: 16,
    frameHeight: 16,
    required: false,
  },
] as const;

export const SELECTED_NINJA_IMAGE_ASSETS: readonly SelectedImageAsset[] = [
  {
    key: ASSET_KEYS.OVERWORLD_TILESET_FIELD,
    assetId: 'NINJA_TILESET_FIELD',
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_TILESET_NATURE,
    assetId: 'NINJA_TILESET_NATURE',
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_TILESET_HOUSE,
    assetId: 'NINJA_TILESET_HOUSE',
    required: true,
  },
  {
    key: ASSET_KEYS.OVERWORLD_PROP_CRATE,
    assetId: 'ITEM_CRATE',
    required: false,
  },
  {
    key: ASSET_KEYS.OVERWORLD_PROP_BAG,
    assetId: 'ITEM_BAG',
    required: false,
  },
] as const;

export type OverworldFacingDirection = 'down' | 'left' | 'right' | 'up';

export const OVERWORLD_FACING_DIRECTIONS: readonly OverworldFacingDirection[] = ['down', 'left', 'right', 'up'];

export const OVERWORLD_PLAYER_DIRECTION_ROW: Record<OverworldFacingDirection, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

export const OVERWORLD_PLAYER_FRAME_COUNT_PER_ROW = 4;

export const OVERWORLD_PLAYER_VISUAL_CONFIG = {
  scale: 2.5,
  collisionWidth: 22,
  collisionHeight: 28,
} as const;

export const OVERWORLD_NPC_VISUAL_CONFIG = {
  scale: 2.4,
} as const;

export const OVERWORLD_AMBIENT_CONFIG = {
  tileSize: 16,
} as const;

