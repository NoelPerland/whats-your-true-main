export const ASSET_KEYS = {
  PIXEL: 'placeholder-pixel',
  TITLE_BG: 'title-bg',
  TITLE_LOGO: 'title-logo',
  UI_PANEL: 'ui-panel',
  OVERWORLD_PLAYER_IDLE_SHEET: 'overworld-player-idle-sheet',
  OVERWORLD_PLAYER_WALK_SHEET: 'overworld-player-walk-sheet',
  OVERWORLD_PLAYER_ATTACK_SHEET: 'overworld-player-attack-sheet',
  OVERWORLD_NPC_GUIDE_SHEET: 'overworld-npc-guide-sheet',
  OVERWORLD_TILESET_FIELD: 'overworld-tileset-field',
  OVERWORLD_TILESET_NATURE: 'overworld-tileset-nature',
  OVERWORLD_TILESET_HOUSE: 'overworld-tileset-house',
  OVERWORLD_AMBIENT_WATER_RIPPLES_SHEET: 'overworld-ambient-water-ripples-sheet',
  OVERWORLD_AMBIENT_FLOWER_SHEET: 'overworld-ambient-flower-sheet',
  OVERWORLD_AMBIENT_FLAG_RED_SHEET: 'overworld-ambient-flag-red-sheet',
  OVERWORLD_AMBIENT_LEAF_PARTICLE_SHEET: 'overworld-ambient-leaf-particle-sheet',
  OVERWORLD_AMBIENT_LANTERN_SHEET: 'overworld-ambient-lantern-sheet',
  BATTLE_ENEMY_BLUE_BAT_SHEET: 'battle-enemy-blue-bat-sheet',
  BATTLE_ENEMY_GREEN_SLIME_SHEET: 'battle-enemy-green-slime-sheet',
  BATTLE_ENEMY_MOUSE_SHEET: 'battle-enemy-mouse-sheet',
  OVERWORLD_PROP_CRATE: 'overworld-prop-crate',
  OVERWORLD_PROP_BAG: 'overworld-prop-bag',
} as const;

export type AssetKey = (typeof ASSET_KEYS)[keyof typeof ASSET_KEYS];

