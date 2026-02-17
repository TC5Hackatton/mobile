import { Session } from '../../entities/Session';
import { SessionRepository } from '../../repositories/SessionRepository';

export class GetStoredSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(): Promise<Session | null> {
    return this.sessionRepository.getStoredSession();
  }
}
