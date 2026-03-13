export type PlayerClassId = 'blade' | 'mage' | 'guardian' | 'rogue';
export type CharacterGender = 'male' | 'female';

export interface ClassBaseStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
}

export interface CharacterClassDefinition {
  id: PlayerClassId;
  displayName: string;
  description: string;
  modelTextureByGender: Record<CharacterGender, string>;
  baseStats: ClassBaseStats;
  startingSkillIds: string[];
}

export interface PortraitOption {
  id: string;
  label: string;
  description: string;
  classId: PlayerClassId;
  gender: CharacterGender;
  textureKey: string;
}
