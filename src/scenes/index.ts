import { BattleScene } from './BattleScene';
import { BootScene } from './BootScene';
import { CharacterCreationScene } from './CharacterCreationScene';
import { OverworldScene } from './OverworldScene';
import { PreloadScene } from './PreloadScene';
import { TitleScene } from './TitleScene';

export const STARTUP_SCENES = [BootScene, PreloadScene, TitleScene, CharacterCreationScene, OverworldScene, BattleScene] as const;
