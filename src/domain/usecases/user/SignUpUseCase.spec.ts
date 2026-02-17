import { User } from '../../entities/User';
import { AuthRepository } from '../../repositories/AuthRepository';
import { SignUpUseCase } from './SignUpUseCase';

describe('SignUpUseCase', () => {
  let signUpUseCase: SignUpUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
      getCurrentUser: jest.fn(),
    };

    signUpUseCase = new SignUpUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should sign up successfully with valid email', async () => {
      const mockUser = User.create(
        'test@example.com',
        'password123',
        'Test User',
        undefined,
        'user-123'
      );

      mockAuthRepository.signUp.mockResolvedValue(mockUser);

      const result = await signUpUseCase.execute('test@example.com', 'password123');

      expect(mockAuthRepository.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockUser);
    });

    it('should throw error with invalid email - missing @', () => {
      expect(() => signUpUseCase.execute('invalidemail.com', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - missing domain', () => {
      expect(() => signUpUseCase.execute('test@', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - missing local part', () => {
      expect(() => signUpUseCase.execute('@example.com', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - no domain extension', () => {
      expect(() => signUpUseCase.execute('test@domain', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should throw error with invalid email - spaces in email', () => {
      expect(() => signUpUseCase.execute('test @example.com', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should throw error with empty email', () => {
      expect(() => signUpUseCase.execute('', 'password123')).toThrow(
        'E-mail Inválido! Por favor, verifique a digitação.'
      );

      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });

    it('should accept email with leading/trailing whitespace and trim it', async () => {
      const mockUser = User.create('test@example.com', 'password', 'User');
      mockAuthRepository.signUp.mockResolvedValue(mockUser);

      await signUpUseCase.execute('  test@example.com  ', 'password123');

      expect(mockAuthRepository.signUp).toHaveBeenCalledWith('  test@example.com  ', 'password123');
      expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
    });

    it('should accept various valid email formats', async () => {
      const mockUser = User.create('test@example.com', 'password', 'User');
      mockAuthRepository.signUp.mockResolvedValue(mockUser);

      await signUpUseCase.execute('simple@test.com', 'pass');
      await signUpUseCase.execute('user.name@domain.co.uk', 'pass');
      await signUpUseCase.execute('user+tag@subdomain.example.com', 'pass');
      await signUpUseCase.execute('user_name@example.com', 'pass');
      await signUpUseCase.execute('123@example.com', 'pass');

      expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(5);
    });

    it('should propagate errors from authRepository', async () => {
      const authError = new Error('Email already exists');
      mockAuthRepository.signUp.mockRejectedValue(authError);

      await expect(signUpUseCase.execute('existing@example.com', 'password123')).rejects.toThrow(
        'Email already exists'
      );

      expect(mockAuthRepository.signUp).toHaveBeenCalledWith('existing@example.com', 'password123');
      expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
    });
  });
});
