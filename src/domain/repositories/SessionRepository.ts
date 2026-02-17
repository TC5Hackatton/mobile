import { Session } from '../entities/Session';

export interface SessionRepository {
  saveSession(session: Session): Promise<void>;
  getStoredSession(): Promise<Session | null>;
  clearSession(): Promise<void>;
}
