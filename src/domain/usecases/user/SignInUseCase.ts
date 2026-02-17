import { Session } from '../../entities/Session';
import { AuthRepository } from '../../repositories/AuthRepository';
import { SessionRepository } from '../../repositories/SessionRepository';

export class SignInUseCase {
  constructor(
    private authRepository: AuthRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(email: string, password: string): Promise<Session> {
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios!');
    }

    const session = await this.authRepository.signIn(email, password);
    await this.sessionRepository.saveSession(session);
    return session;
  }
}
