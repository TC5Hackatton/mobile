import { AuthRepository } from '../../repositories/AuthRepository';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

describe('ForgotPasswordUseCase', () => {
  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
      getCurrentUser: jest.fn(),
    };

    forgotPasswordUseCase = new ForgotPasswordUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should send password reset email with valid email', async () => {
      mockAuthRepository.forgotPassword.mockResolvedValue(undefined);

      await forgotPasswordUseCase.execute('test@example.com');

      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should throw error with invalid email - missing @', () => {
      expect(() => forgotPasswordUseCase.execute('invalidemail.com')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - missing domain', () => {
      expect(() => forgotPasswordUseCase.execute('test@')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - missing local part', () => {
      expect(() => forgotPasswordUseCase.execute('@example.com')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - no domain extension', () => {
      expect(() => forgotPasswordUseCase.execute('test@domain')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - spaces in email', () => {
      expect(() => forgotPasswordUseCase.execute('test @example.com')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should throw error with empty email', () => {
      expect(() => forgotPasswordUseCase.execute('')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
    });

    it('should accept email with leading/trailing whitespace and trim it', async () => {
      mockAuthRepository.forgotPassword.mockResolvedValue(undefined);

      await forgotPasswordUseCase.execute('  test@example.com  ');

      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith('  test@example.com  ');
      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should accept various valid email formats', async () => {
      mockAuthRepository.forgotPassword.mockResolvedValue(undefined);

      await forgotPasswordUseCase.execute('simple@test.com');
      await forgotPasswordUseCase.execute('user.name@domain.co.uk');
      await forgotPasswordUseCase.execute('user+tag@subdomain.example.com');
      await forgotPasswordUseCase.execute('user_name@example.com');
      await forgotPasswordUseCase.execute('123@example.com');

      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(5);
    });

    it('should propagate errors from authRepository', async () => {
      const authError = new Error('Email not found');
      mockAuthRepository.forgotPassword.mockRejectedValue(authError);

      await expect(forgotPasswordUseCase.execute('nonexistent@example.com')).rejects.toThrow(
        'Email not found'
      );

      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith('nonexistent@example.com');
      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network connection failed');
      mockAuthRepository.forgotPassword.mockRejectedValue(networkError);

      await expect(forgotPasswordUseCase.execute('test@example.com')).rejects.toThrow(
        'Network connection failed'
      );

      expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1);
    });
  });
});
