import classesJson from '../../content/characterCreation/classes.json';
import portraitsJson from '../../content/characterCreation/portraits.json';
import type {
  CharacterGender,
  CharacterClassDefinition,
  ClassBaseStats,
  PlayerClassId,
  PortraitOption,
} from '../../data/types/CharacterCreation';
import { logger } from '../../utils/logger';

const REQUIRED_CLASS_IDS: readonly PlayerClassId[] = ['blade', 'mage', 'guardian', 'rogue'];
const GENDER_IDS: readonly CharacterGender[] = ['male', 'female'];

const FALLBACK_CLASSES: CharacterClassDefinition[] = [
  {
    id: 'blade',
    displayName: 'Blade',
    description: 'Balanced melee attacker with solid offense and defense.',
    modelTextureByGender: {
      male: 'class_model_blade_male',
      female: 'class_model_blade_female',
    },
    baseStats: { hp: 120, mp: 30, attack: 14, defense: 11, magic: 6, speed: 9 },
    startingSkillIds: ['blade_slash', 'focus_guard'],
  },
  {
    id: 'mage',
    displayName: 'Mage',
    description: 'Elemental caster with high magic and low durability.',
    modelTextureByGender: {
      male: 'class_model_mage_male',
      female: 'class_model_mage_female',
    },
    baseStats: { hp: 80, mp: 70, attack: 6, defense: 7, magic: 16, speed: 10 },
    startingSkillIds: ['arcane_bolt', 'ember_spark'],
  },
  {
    id: 'guardian',
    displayName: 'Guardian',
    description: 'Defensive frontline with high HP and protection tools.',
    modelTextureByGender: {
      male: 'class_model_guardian_male',
      female: 'class_model_guardian_female',
    },
    baseStats: { hp: 140, mp: 25, attack: 10, defense: 15, magic: 5, speed: 6 },
    startingSkillIds: ['shield_bash', 'fortify'],
  },
  {
    id: 'rogue',
    displayName: 'Rogue',
    description: 'Fast striker with high speed and precision damage.',
    modelTextureByGender: {
      male: 'class_model_rogue_male',
      female: 'class_model_rogue_female',
    },
    baseStats: { hp: 95, mp: 35, attack: 12, defense: 8, magic: 7, speed: 15 },
    startingSkillIds: ['quick_stab', 'shadow_step'],
  },
];

const FALLBACK_PORTRAITS: PortraitOption[] = [
  {
    id: 'portrait_blade_male',
    label: 'Samurai',
    description: 'Traditional swordsman portrait for a male Blade.',
    classId: 'blade',
    gender: 'male',
    textureKey: 'portrait_blade_male',
  },
  {
    id: 'portrait_blade_female',
    label: 'Princess Knight',
    description: 'Noble frontline portrait for a female Blade.',
    classId: 'blade',
    gender: 'female',
    textureKey: 'portrait_blade_female',
  },
  {
    id: 'portrait_mage_male',
    label: 'Dark Sorcerer',
    description: 'Arcane caster portrait for a male Mage.',
    classId: 'mage',
    gender: 'male',
    textureKey: 'portrait_mage_male',
  },
  {
    id: 'portrait_mage_female',
    label: 'Mystic',
    description: 'Focused caster portrait for a female Mage.',
    classId: 'mage',
    gender: 'female',
    textureKey: 'portrait_mage_female',
  },
  {
    id: 'portrait_guardian_male',
    label: 'Elder Guard',
    description: 'Veteran defender portrait for a male Guardian.',
    classId: 'guardian',
    gender: 'male',
    textureKey: 'portrait_guardian_male',
  },
  {
    id: 'portrait_guardian_female',
    label: 'Cave Sentinel',
    description: 'Reliable protector portrait for a female Guardian.',
    classId: 'guardian',
    gender: 'female',
    textureKey: 'portrait_guardian_female',
  },
  {
    id: 'portrait_rogue_male',
    label: 'Red Ninja',
    description: 'Stealth-oriented portrait for a male Rogue.',
    classId: 'rogue',
    gender: 'male',
    textureKey: 'portrait_rogue_male',
  },
  {
    id: 'portrait_rogue_female',
    label: 'Shadow Scout',
    description: 'Agile infiltrator portrait for a female Rogue.',
    classId: 'rogue',
    gender: 'female',
    textureKey: 'portrait_rogue_female',
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const parseClassId = (value: unknown): PlayerClassId | null => {
  if (typeof value !== 'string') {
    return null;
  }

  return REQUIRED_CLASS_IDS.includes(value as PlayerClassId) ? (value as PlayerClassId) : null;
};

const parseGender = (value: unknown): CharacterGender | null => {
  if (typeof value !== 'string') {
    return null;
  }

  return GENDER_IDS.includes(value as CharacterGender) ? (value as CharacterGender) : null;
};

const parseModelTextureByGender = (value: unknown): Record<CharacterGender, string> | null => {
  if (!isRecord(value)) {
    return null;
  }

  const male = value.male;
  const female = value.female;

  if (typeof male !== 'string' || typeof female !== 'string') {
    return null;
  }

  return { male, female };
};

const parseClassBaseStats = (value: unknown): ClassBaseStats | null => {
  if (!isRecord(value)) {
    return null;
  }

  const hp = value.hp;
  const mp = value.mp;
  const attack = value.attack;
  const defense = value.defense;
  const magic = value.magic;
  const speed = value.speed;

  if (
    typeof hp !== 'number' ||
    typeof mp !== 'number' ||
    typeof attack !== 'number' ||
    typeof defense !== 'number' ||
    typeof magic !== 'number' ||
    typeof speed !== 'number'
  ) {
    return null;
  }

  return { hp, mp, attack, defense, magic, speed };
};

const parseCharacterClassDefinition = (value: unknown): CharacterClassDefinition | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseClassId(value.id);
  const displayName = value.displayName;
  const description = value.description;
  const modelTextureByGender = parseModelTextureByGender(value.modelTextureByGender);
  const baseStats = parseClassBaseStats(value.baseStats);
  const startingSkillIds = value.startingSkillIds;

  if (
    !id ||
    typeof displayName !== 'string' ||
    typeof description !== 'string' ||
    !modelTextureByGender ||
    !baseStats
  ) {
    return null;
  }

  if (!Array.isArray(startingSkillIds) || !startingSkillIds.every((skillId) => typeof skillId === 'string')) {
    return null;
  }

  return {
    id,
    displayName,
    description,
    modelTextureByGender,
    baseStats,
    startingSkillIds,
  };
};

const parsePortraitOption = (value: unknown): PortraitOption | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const label = value.label;
  const description = value.description;
  const classId = parseClassId(value.classId);
  const gender = parseGender(value.gender);
  const textureKey = value.textureKey;

  if (
    typeof id !== 'string' ||
    typeof label !== 'string' ||
    typeof description !== 'string' ||
    !classId ||
    !gender ||
    typeof textureKey !== 'string'
  ) {
    return null;
  }

  return {
    id,
    label,
    description,
    classId,
    gender,
    textureKey,
  };
};

export class CharacterCreationContentLoader {
  static getClassDefinitions(): CharacterClassDefinition[] {
    const rawClasses: unknown = classesJson;
    if (!Array.isArray(rawClasses)) {
      logger.warn('Character classes content is invalid. Using fallback classes.');
      return cloneValue(FALLBACK_CLASSES);
    }

    const classById = new Map<PlayerClassId, CharacterClassDefinition>();
    for (const entry of rawClasses) {
      const parsed = parseCharacterClassDefinition(entry);
      if (!parsed) {
        continue;
      }

      classById.set(parsed.id, parsed);
    }

    const hasAllClasses = REQUIRED_CLASS_IDS.every((classId) => classById.has(classId));
    if (!hasAllClasses) {
      logger.warn('Character classes content is missing required classes. Using fallback classes.');
      return cloneValue(FALLBACK_CLASSES);
    }

    return REQUIRED_CLASS_IDS.map((classId) => cloneValue(classById.get(classId)!));
  }

  static getPortraitOptions(): PortraitOption[] {
    const rawPortraits: unknown = portraitsJson;
    if (!Array.isArray(rawPortraits)) {
      logger.warn('Portrait options content is invalid. Using fallback portraits.');
      return cloneValue(FALLBACK_PORTRAITS);
    }

    const parsedPortraits = rawPortraits
      .map((entry) => parsePortraitOption(entry))
      .filter((entry): entry is PortraitOption => entry !== null);

    if (parsedPortraits.length === 0) {
      logger.warn('Portrait options content is empty. Using fallback portraits.');
      return cloneValue(FALLBACK_PORTRAITS);
    }

    for (const classId of REQUIRED_CLASS_IDS) {
      for (const gender of GENDER_IDS) {
        const hasEntry = parsedPortraits.some(
          (portrait) => portrait.classId === classId && portrait.gender === gender,
        );

        if (!hasEntry) {
          logger.warn('Portrait options content is missing required class/gender entries. Using fallback portraits.');
          return cloneValue(FALLBACK_PORTRAITS);
        }
      }
    }

    return cloneValue(parsedPortraits);
  }
}
