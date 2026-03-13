import { ASSET_KEYS } from '../../core/constants/assetKeys';
import { ANIMATION_KEYS } from '../../core/constants/animationKeys';

export interface BattleSpriteConfig {
  textureKey: string;
  animationKey: string;
  frameStart: number;
  frameEnd: number;
  frameRate: number;
  scale: number;
}

const DEFAULT_ENEMY_SPRITE: BattleSpriteConfig = {
  textureKey: ASSET_KEYS.BATTLE_ENEMY_BLUE_BAT_SHEET,
  animationKey: ANIMATION_KEYS.BATTLE_ENEMY_BLUE_BAT_IDLE,
  frameStart: 0,
  frameEnd: 3,
  frameRate: 8,
  scale: 3.4,
};

const ENEMY_SPRITE_BY_ID: Record<string, BattleSpriteConfig> = {
  enemy_slime: {
    textureKey: ASSET_KEYS.BATTLE_ENEMY_GREEN_SLIME_SHEET,
    animationKey: ANIMATION_KEYS.BATTLE_ENEMY_GREEN_SLIME_IDLE,
    frameStart: 0,
    frameEnd: 0,
    frameRate: 1,
    scale: 0.95,
  },
  enemy_mouse: {
    textureKey: ASSET_KEYS.BATTLE_ENEMY_MOUSE_SHEET,
    animationKey: ANIMATION_KEYS.BATTLE_ENEMY_MOUSE_IDLE,
    frameStart: 0,
    frameEnd: 3,
    frameRate: 7,
    scale: 3.2,
  },
};

export const BATTLE_PLAYER_SPRITE: BattleSpriteConfig = {
  textureKey: ASSET_KEYS.OVERWORLD_PLAYER_WALK_SHEET,
  animationKey: ANIMATION_KEYS.BATTLE_PLAYER_IDLE,
  frameStart: 0,
  frameEnd: 3,
  frameRate: 7,
  scale: 3.8,
};

export const resolveBattleEnemySprite = (enemyId: string): BattleSpriteConfig => {
  return ENEMY_SPRITE_BY_ID[enemyId] ?? DEFAULT_ENEMY_SPRITE;
};
