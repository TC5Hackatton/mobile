import { User } from '../../entities/User';
import { AuthRepository } from '../../repositories/AuthRepository';
import { SignInUseCase } from './SignInUseCase';

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
      getCurrentUser: jest.fn(),
    };

    signInUseCase = new SignInUseCase(mockAuthRepository);
  });

  it('should sign in successfully with valid credentials', async () => {
    const mockUser = User.create(
      'test@example.com',
      'password123',
      'Test User',
      undefined,
      'user-123'
    );

    mockAuthRepository.signIn.mockResolvedValue(mockUser);

    const result = await signInUseCase.execute('test@example.com', 'password123');

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockAuthRepository.signIn).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockUser);
  });

  it('should throw error when email is empty string', () => {
    expect(() => signInUseCase.execute('', 'password123')).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when email is null', () => {
    expect(() => signInUseCase.execute(null as any, 'password123')).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when email is undefined', () => {
    expect(() => signInUseCase.execute(undefined as any, 'password123')).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is empty string', () => {
    expect(() => signInUseCase.execute('test@example.com', '')).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is null', () => {
    expect(() => signInUseCase.execute('test@example.com', null as any)).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is undefined', () => {
    expect(() => signInUseCase.execute('test@example.com', undefined as any)).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when both email and password are empty', () => {
    expect(() => signInUseCase.execute('', '')).toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should propagate errors from authRepository', async () => {
    const authError = new Error('Invalid credentials');
    mockAuthRepository.signIn.mockRejectedValue(authError);

    await expect(signInUseCase.execute('test@example.com', 'wrongpassword')).rejects.toThrow(
      'Invalid credentials'
    );

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(mockAuthRepository.signIn).toHaveBeenCalledTimes(1);
  });

  it('should accept various valid email formats', async () => {
    const mockUser = User.create('test@example.com', 'password', 'User');
    mockAuthRepository.signIn.mockResolvedValue(mockUser);

    await signInUseCase.execute('user@domain.com', 'pass');
    await signInUseCase.execute('user.name@domain.co.uk', 'pass');
    await signInUseCase.execute('user+tag@subdomain.example.com', 'pass');

    expect(mockAuthRepository.signIn).toHaveBeenCalledTimes(3);
  });
});
