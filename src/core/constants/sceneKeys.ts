export const SCENE_KEYS = {
  BOOT: 'BOOT',
  PRELOAD: 'PRELOAD',
  TITLE: 'TITLE',
  CHARACTER_CREATION: 'CHARACTER_CREATION',
  OVERWORLD: 'OVERWORLD',
  BATTLE: 'BATTLE',
} as const;

export type SceneKey = (typeof SCENE_KEYS)[keyof typeof SCENE_KEYS];
