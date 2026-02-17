import { AuthRepository } from '../../repositories/AuthRepository';
import { SessionRepository } from '../../repositories/SessionRepository';

export class SignOutUseCase {
  constructor(
    private authRepository: AuthRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(): Promise<void> {
    await this.authRepository.signOut();
    await this.sessionRepository.clearSession();
  }
}
