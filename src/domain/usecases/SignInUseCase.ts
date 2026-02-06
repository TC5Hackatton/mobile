import { AuthRepository } from '../repositories/AuthRepository';

export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios!');
    }

    return this.authRepository.signIn(email, password);
  }
}
