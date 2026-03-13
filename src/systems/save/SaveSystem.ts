import type { GameSession } from '../../data/types/GameSession';
import { logger } from '../../utils/logger';

export class SaveSystem {
  constructor(private readonly storageKey: string) {}

  hasSave(): boolean {
    if (!this.canUseStorage()) {
      return false;
    }

    return window.localStorage.getItem(this.storageKey) !== null;
  }

  load(): GameSession | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as GameSession;
    } catch (error: unknown) {
      logger.warn('Failed to parse save data. Clearing invalid save slot.', error);
      this.clear();
      return null;
    }
  }

  save(session: GameSession): void {
    if (!this.canUseStorage()) {
      logger.warn('localStorage unavailable. Save skipped.');
      return;
    }

    const serialized = JSON.stringify(session);
    window.localStorage.setItem(this.storageKey, serialized);
  }

  clear(): void {
    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.removeItem(this.storageKey);
  }

  private canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
