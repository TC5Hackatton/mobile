import { AuthRepository } from '../repositories/AuthRepository';

export class CreateUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string) {
    if (!this.isValidEmail(email)) {
      throw new Error('E-mail Inválido! Por favor, verifique a digitação.');
    }

    return this.authRepository.signUp(email, password);
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  }
}
