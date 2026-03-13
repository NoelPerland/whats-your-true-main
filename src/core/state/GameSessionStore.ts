import type { GameSession } from '../../data/types/GameSession';

const cloneSession = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class GameSessionStore {
  private currentSession: GameSession | null = null;

  getSession(): GameSession | null {
    return this.currentSession ? cloneSession(this.currentSession) : null;
  }

  setSession(session: GameSession): void {
    this.currentSession = cloneSession(session);
  }

  clearSession(): void {
    this.currentSession = null;
  }

  seedFromTemplate(template: GameSession): GameSession {
    const now = new Date().toISOString();
    const nextSession: GameSession = {
      ...cloneSession(template),
      createdAt: now,
      updatedAt: now,
    };

    this.setSession(nextSession);
    return nextSession;
  }
}

export const gameSessionStore = new GameSessionStore();
