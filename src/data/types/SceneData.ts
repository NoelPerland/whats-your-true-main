import type { BattleEncounterDefinition } from './Battle';
import type { GameSession } from './GameSession';

export interface CharacterCreationSceneData {
  sessionSeed?: GameSession;
}

export interface OverworldSceneData {
  restoredSession?: GameSession;
  battleSummary?: string;
}

export interface BattleSceneData {
  session?: GameSession;
  encounter: BattleEncounterDefinition;
  returnToMapId?: string;
}
