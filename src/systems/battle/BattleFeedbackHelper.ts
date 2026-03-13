import Phaser from 'phaser';

import type { BattleEvent } from '../../data/types/Battle';
import type { BattleActorVisual } from '../../ui/battle/BattleActorVisual';

export interface BattleFeedbackActors {
  playerActorId: string;
  enemyActorId: string;
  playerVisual: BattleActorVisual;
  enemyVisual: BattleActorVisual;
}

const resolveVisualByActorId = (actors: BattleFeedbackActors, actorId: string): BattleActorVisual | null => {
  if (actorId === actors.playerActorId) {
    return actors.playerVisual;
  }

  if (actorId === actors.enemyActorId) {
    return actors.enemyVisual;
  }

  return null;
};

export const playBattleFeedback = (
  scene: Phaser.Scene,
  events: BattleEvent[],
  actors: BattleFeedbackActors,
): void => {
  for (const event of events) {
    if (event.type !== 'damage') {
      continue;
    }

    const attacker = event.actorId ? resolveVisualByActorId(actors, event.actorId) : null;
    const target = event.targetId ? resolveVisualByActorId(actors, event.targetId) : null;

    if (!attacker || !target) {
      continue;
    }

    attacker.playAttackLunge(target.getPositionX());

    scene.time.delayedCall(95, () => {
      target.playHitReaction();
      if (event.amount) {
        target.showDamageNumber(event.amount);
      }
    });
  }
};

export const formatBattleEventsForLog = (events: BattleEvent[]): string | null => {
  const orderedMessages = events
    .map((event) => event.message.trim())
    .filter((message) => message.length > 0);

  if (orderedMessages.length === 0) {
    return null;
  }

  return orderedMessages.join('\n');
};
