export const ANIMATION_KEYS = {
  OVERWORLD_PLAYER_IDLE_DOWN: 'overworld-player-idle-down',
  OVERWORLD_PLAYER_IDLE_LEFT: 'overworld-player-idle-left',
  OVERWORLD_PLAYER_IDLE_RIGHT: 'overworld-player-idle-right',
  OVERWORLD_PLAYER_IDLE_UP: 'overworld-player-idle-up',
  OVERWORLD_PLAYER_WALK_DOWN: 'overworld-player-walk-down',
  OVERWORLD_PLAYER_WALK_LEFT: 'overworld-player-walk-left',
  OVERWORLD_PLAYER_WALK_RIGHT: 'overworld-player-walk-right',
  OVERWORLD_PLAYER_WALK_UP: 'overworld-player-walk-up',
  OVERWORLD_PLAYER_ATTACK_DOWN: 'overworld-player-attack-down',
  OVERWORLD_NPC_GUIDE_IDLE: 'overworld-npc-guide-idle',
  OVERWORLD_AMBIENT_WATER_RIPPLE: 'overworld-ambient-water-ripple',
  OVERWORLD_AMBIENT_FLOWER_SWAY: 'overworld-ambient-flower-sway',
  OVERWORLD_AMBIENT_FLAG_RED_WAVE: 'overworld-ambient-flag-red-wave',
  OVERWORLD_AMBIENT_LANTERN_FLICKER: 'overworld-ambient-lantern-flicker',
  BATTLE_ENEMY_BLUE_BAT_IDLE: 'battle-enemy-blue-bat-idle',
  BATTLE_ENEMY_GREEN_SLIME_IDLE: 'battle-enemy-green-slime-idle',
  BATTLE_ENEMY_MOUSE_IDLE: 'battle-enemy-mouse-idle',
  BATTLE_PLAYER_IDLE: 'battle-player-idle',
} as const;

export type AnimationKey = (typeof ANIMATION_KEYS)[keyof typeof ANIMATION_KEYS];

