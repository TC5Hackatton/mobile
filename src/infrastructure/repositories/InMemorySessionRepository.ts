import { Session } from '@/src/domain/entities/Session';
import { SessionRepository } from '@/src/domain/repositories/SessionRepository';
import { StorageRepository } from '@/src/domain/repositories/StorageRepository';

const SESSION_STORAGE_KEY = '@session';

export class InMemorySessionRepository implements SessionRepository {
  constructor(private storageRepository: StorageRepository) {}

  async saveSession(session: Session): Promise<void> {
    await this.storageRepository.setItem(SESSION_STORAGE_KEY, session.toJSON());
  }

  async getStoredSession(): Promise<Session | null> {
    const sessionData = await this.storageRepository.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;

    try {
      return Session.fromJSON(sessionData);
    } catch {
      // Invalid session data, clear it
      await this.clearSession();
      return null;
    }
  }

  async clearSession(): Promise<void> {
    await this.storageRepository.removeItem(SESSION_STORAGE_KEY);
  }
}
