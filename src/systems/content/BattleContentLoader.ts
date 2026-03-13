import Phaser from 'phaser';
import earlyEncountersJson from '../../content/battle/earlyEncounters.json';
import starterEncounterJson from '../../content/battle/starterEncounter.json';
import type { BattleEncounterDefinition } from '../../data/types/Battle';
import { logger } from '../../utils/logger';

const FALLBACK_ENCOUNTER: BattleEncounterDefinition = {
  encounterId: 'starter_slime',
  name: 'Roadside Slime',
  introText: 'A wild slime bounces into your path!',
  rewardText: 'You gained confidence from the skirmish.',
  enemy: {
    id: 'enemy_slime',
    name: 'Green Slime',
    maxHp: 36,
    attack: 9,
    defense: 3,
    speed: 8,
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isPositiveNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
};

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const parseEncounter = (value: unknown): BattleEncounterDefinition | null => {
  if (!isRecord(value)) {
    return null;
  }

  const encounterId = value.encounterId;
  const name = value.name;
  const introText = value.introText;
  const rewardText = value.rewardText;
  const enemy = value.enemy;

  if (
    typeof encounterId !== 'string' ||
    typeof name !== 'string' ||
    typeof introText !== 'string' ||
    typeof rewardText !== 'string' ||
    !isRecord(enemy)
  ) {
    return null;
  }

  const enemyId = enemy.id;
  const enemyName = enemy.name;
  const enemyMaxHp = enemy.maxHp;
  const enemyAttack = enemy.attack;
  const enemyDefense = enemy.defense;
  const enemySpeed = enemy.speed;

  if (
    typeof enemyId !== 'string' ||
    typeof enemyName !== 'string' ||
    !isPositiveNumber(enemyMaxHp) ||
    !isPositiveNumber(enemyAttack) ||
    !isPositiveNumber(enemyDefense) ||
    !isPositiveNumber(enemySpeed)
  ) {
    return null;
  }

  return {
    encounterId,
    name,
    introText,
    rewardText,
    enemy: {
      id: enemyId,
      name: enemyName,
      maxHp: enemyMaxHp,
      attack: enemyAttack,
      defense: enemyDefense,
      speed: enemySpeed,
    },
  };
};

const parseEncounterArray = (value: unknown): BattleEncounterDefinition[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsed = value.map((entry) => parseEncounter(entry)).filter((entry): entry is BattleEncounterDefinition => entry !== null);
  return parsed;
};

export class BattleContentLoader {
  static getStarterEncounter(): BattleEncounterDefinition {
    const parsed = parseEncounter(starterEncounterJson as unknown);
    if (!parsed) {
      logger.warn('Battle encounter content is invalid. Using fallback encounter.');
      return cloneValue(FALLBACK_ENCOUNTER);
    }

    return cloneValue(parsed);
  }

  static getEarlyEncounterPool(): BattleEncounterDefinition[] {
    const parsedPool = parseEncounterArray(earlyEncountersJson as unknown);
    if (parsedPool.length === 0) {
      logger.warn('Early encounter pool is invalid. Using fallback encounter only.');
      return [cloneValue(FALLBACK_ENCOUNTER)];
    }

    return parsedPool.map((entry) => cloneValue(entry));
  }

  static getRandomEarlyEncounter(randomValue: number = Math.random()): BattleEncounterDefinition {
    const pool = this.getEarlyEncounterPool();
    if (pool.length === 0) {
      return cloneValue(FALLBACK_ENCOUNTER);
    }

    const normalized = Number.isFinite(randomValue) ? Phaser.Math.Clamp(randomValue, 0, 0.999999) : Math.random();
    const index = Math.floor(normalized * pool.length);

    return cloneValue(pool[index] ?? pool[0] ?? FALLBACK_ENCOUNTER);
  }
}

