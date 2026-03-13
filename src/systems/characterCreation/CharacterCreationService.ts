import type {
  CharacterClassDefinition,
  CharacterGender,
  PortraitOption,
} from '../../data/types/CharacterCreation';
import type { GameSession, PlayerProfile } from '../../data/types/GameSession';

export interface CreatePlayerProfileInput {
  name: string;
  gender: CharacterGender;
  classDefinition: CharacterClassDefinition;
  portrait: PortraitOption;
}

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class CharacterCreationService {
  static normalizeName(rawName: string): string {
    const collapsed = rawName.replace(/\s+/g, ' ').trim();
    if (collapsed.length === 0) {
      return '';
    }

    return collapsed.slice(0, 14);
  }

  static createPlayerProfile(input: CreatePlayerProfileInput): PlayerProfile {
    const normalizedName = this.normalizeName(input.name);

    return {
      name: normalizedName,
      gender: input.gender,
      classId: input.classDefinition.id,
      portraitId: input.portrait.id,
      appearanceId: input.portrait.id,
      pronouns: input.gender === 'female' ? 'she/her' : 'he/him',
      baseStats: cloneValue(input.classDefinition.baseStats),
      learnedSkillIds: [...input.classDefinition.startingSkillIds],
    };
  }

  static getPortraitForClassAndGender(
    portraits: PortraitOption[],
    classId: CharacterClassDefinition['id'],
    gender: CharacterGender,
  ): PortraitOption | null {
    return portraits.find((portrait) => portrait.classId === classId && portrait.gender === gender) ?? null;
  }

  static applyProfileToSession(session: GameSession, profile: PlayerProfile): GameSession {
    const nextSession = cloneValue(session);
    nextSession.playerProfile = cloneValue(profile);
    nextSession.updatedAt = new Date().toISOString();
    return nextSession;
  }
}
