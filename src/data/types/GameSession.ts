import type { CharacterGender, PlayerClassId } from './CharacterCreation';

export interface BaseStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
}

export interface PlayerProfile {
  name: string;
  gender: CharacterGender;
  classId: PlayerClassId;
  portraitId: string;
  appearanceId: string;
  pronouns: string;
  baseStats: BaseStats;
  learnedSkillIds: string[];
}

export interface PartyMemberState {
  id: string;
  level: number;
  hp: number;
  mp: number;
}

export interface InventoryItemState {
  itemId: string;
  quantity: number;
}

export interface InventoryState {
  items: InventoryItemState[];
}

export interface EquipmentState {
  equippedByMemberId: Record<string, Record<string, string>>;
}

export interface QuestState {
  questId: string;
  status: 'inactive' | 'active' | 'completed';
}

export interface MapState {
  mapId: string;
  spawnPointId: string;
}

export interface ProgressionState {
  chapter: number;
  storyStep: string;
}

export interface GameSession {
  version: number;
  createdAt: string;
  updatedAt: string;
  playerProfile: PlayerProfile | null;
  party: PartyMemberState[];
  inventory: InventoryState;
  equipment: EquipmentState;
  quests: QuestState[];
  flags: Record<string, boolean>;
  mapState: MapState;
  progression: ProgressionState;
}
