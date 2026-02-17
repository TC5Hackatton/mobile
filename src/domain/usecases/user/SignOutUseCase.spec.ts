import { AuthRepository } from '../../repositories/AuthRepository';
import { SessionRepository } from '../../repositories/SessionRepository';
import { SignOutUseCase } from './SignOutUseCase';

describe('SignOutUseCase', () => {
  let signOutUseCase: SignOutUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
    } as jest.Mocked<AuthRepository>;

    mockSessionRepository = {
      saveSession: jest.fn(),
      getStoredSession: jest.fn(),
      clearSession: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    signOutUseCase = new SignOutUseCase(mockAuthRepository, mockSessionRepository);
  });

  it('should call signOut on auth repository', async () => {
    mockAuthRepository.signOut.mockResolvedValue();
    mockSessionRepository.clearSession.mockResolvedValue();

    await signOutUseCase.execute();

    expect(mockAuthRepository.signOut).toHaveBeenCalledTimes(1);
  });

  it('should clear session from session repository', async () => {
    mockAuthRepository.signOut.mockResolvedValue();
    mockSessionRepository.clearSession.mockResolvedValue();

    await signOutUseCase.execute();

    expect(mockSessionRepository.clearSession).toHaveBeenCalledTimes(1);
  });

  it('should call both signOut and clearSession in correct order', async () => {
    const callOrder: string[] = [];

    mockAuthRepository.signOut.mockImplementation(async () => {
      callOrder.push('signOut');
    });

    mockSessionRepository.clearSession.mockImplementation(async () => {
      callOrder.push('clearSession');
    });

    await signOutUseCase.execute();

    expect(callOrder).toEqual(['signOut', 'clearSession']);
  });

  it('should propagate errors from auth repository', async () => {
    const error = new Error('Auth sign out failed');
    mockAuthRepository.signOut.mockRejectedValue(error);

    await expect(signOutUseCase.execute()).rejects.toThrow('Auth sign out failed');
    expect(mockAuthRepository.signOut).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from session repository', async () => {
    mockAuthRepository.signOut.mockResolvedValue();
    const error = new Error('Session clear failed');
    mockSessionRepository.clearSession.mockRejectedValue(error);

    await expect(signOutUseCase.execute()).rejects.toThrow('Session clear failed');
    expect(mockAuthRepository.signOut).toHaveBeenCalledTimes(1);
    expect(mockSessionRepository.clearSession).toHaveBeenCalledTimes(1);
  });

  it('should not call clearSession if signOut fails', async () => {
    const error = new Error('Sign out failed');
    mockAuthRepository.signOut.mockRejectedValue(error);

    await expect(signOutUseCase.execute()).rejects.toThrow();

    expect(mockAuthRepository.signOut).toHaveBeenCalledTimes(1);
    expect(mockSessionRepository.clearSession).not.toHaveBeenCalled();
  });
});
