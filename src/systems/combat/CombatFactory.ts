import type { CombatSetup, BattleEncounterDefinition, BattleActorState } from '../../data/types/Battle';
import type { GameSession } from '../../data/types/GameSession';

const clampStat = (value: number, minimum: number): number => {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : minimum;
};

const createPlayerActor = (session: GameSession): BattleActorState => {
  const profile = session.playerProfile;

  const playerName = profile?.name && profile.name.trim().length > 0 ? profile.name.trim() : 'Hero';
  const maxHp = clampStat(profile?.baseStats.hp ?? 100, 1);
  const attack = clampStat(profile?.baseStats.attack ?? 12, 1);
  const defense = clampStat(profile?.baseStats.defense ?? 8, 1);
  const speed = clampStat(profile?.baseStats.speed ?? 10, 1);

  return {
    id: 'player_actor',
    name: playerName,
    team: 'player',
    maxHp,
    hp: maxHp,
    attack,
    defense,
    speed,
    isDefending: false,
  };
};

const createEnemyActor = (encounter: BattleEncounterDefinition): BattleActorState => {
  return {
    id: encounter.enemy.id,
    name: encounter.enemy.name,
    team: 'enemy',
    maxHp: encounter.enemy.maxHp,
    hp: encounter.enemy.maxHp,
    attack: encounter.enemy.attack,
    defense: encounter.enemy.defense,
    speed: encounter.enemy.speed,
    isDefending: false,
  };
};

export class CombatFactory {
  static createSetup(session: GameSession, encounter: BattleEncounterDefinition): CombatSetup {
    return {
      playerActor: createPlayerActor(session),
      enemyActor: createEnemyActor(encounter),
    };
  }
}
