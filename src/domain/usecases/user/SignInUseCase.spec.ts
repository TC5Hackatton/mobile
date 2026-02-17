import { Session } from '../../entities/Session';
import { AuthRepository } from '../../repositories/AuthRepository';
import { SessionRepository } from '../../repositories/SessionRepository';
import { SignInUseCase } from './SignInUseCase';

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
    };

    mockSessionRepository = {
      saveSession: jest.fn(),
      getStoredSession: jest.fn(),
      clearSession: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    signInUseCase = new SignInUseCase(mockAuthRepository, mockSessionRepository);
  });

  it('should sign in successfully with valid credentials', async () => {
    const mockSession = Session.create('user-123', 'mock-token-123');

    mockAuthRepository.signIn.mockResolvedValue(mockSession);
    mockSessionRepository.saveSession.mockResolvedValue(undefined);

    const result = await signInUseCase.execute('test@example.com', 'password123');

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockAuthRepository.signIn).toHaveBeenCalledTimes(1);
    expect(mockSessionRepository.saveSession).toHaveBeenCalledWith(mockSession);
    expect(mockSessionRepository.saveSession).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockSession);
  });

  it('should throw error when email is empty string', async () => {
    await expect(signInUseCase.execute('', 'password123')).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when email is null', async () => {
    await expect(signInUseCase.execute(null as any, 'password123')).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when email is undefined', async () => {
    await expect(signInUseCase.execute(undefined as any, 'password123')).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is empty string', async () => {
    await expect(signInUseCase.execute('test@example.com', '')).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is null', async () => {
    await expect(signInUseCase.execute('test@example.com', null as any)).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when password is undefined', async () => {
    await expect(signInUseCase.execute('test@example.com', undefined as any)).rejects.toThrow(
      'E-mail e senha são obrigatórios!'
    );

    expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
  });

  it('should throw error when both email and password are empty', async () => {
    await expect(signInUseCase.execute('', '')).rejects.toThrow(
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
    const mockSession = Session.create('user-123', 'mock-token');
    mockAuthRepository.signIn.mockResolvedValue(mockSession);
    mockSessionRepository.saveSession.mockResolvedValue(undefined);

    await signInUseCase.execute('user@domain.com', 'pass');
    await signInUseCase.execute('user.name@domain.co.uk', 'pass');
    await signInUseCase.execute('user+tag@subdomain.example.com', 'pass');

    expect(mockAuthRepository.signIn).toHaveBeenCalledTimes(3);
    expect(mockSessionRepository.saveSession).toHaveBeenCalledTimes(3);
  });
});
