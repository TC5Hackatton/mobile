import { Session } from '../../entities/Session';
import { SessionRepository } from '../../repositories/SessionRepository';
import { GetStoredSessionUseCase } from './GetStoredSessionUseCase';

describe('GetStoredSessionUseCase', () => {
  let getStoredSessionUseCase: GetStoredSessionUseCase;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockSessionRepository = {
      saveSession: jest.fn(),
      getStoredSession: jest.fn(),
      clearSession: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    getStoredSessionUseCase = new GetStoredSessionUseCase(mockSessionRepository);
  });

  it('should return stored session when it exists', async () => {
    const mockSession = Session.create('user-123', 'token-abc');
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession);

    const result = await getStoredSessionUseCase.execute();

    expect(result).toBe(mockSession);
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
  });

  it('should return null when no session is stored', async () => {
    mockSessionRepository.getStoredSession.mockResolvedValue(null);

    const result = await getStoredSessionUseCase.execute();

    expect(result).toBeNull();
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from repository', async () => {
    const error = new Error('Storage error');
    mockSessionRepository.getStoredSession.mockRejectedValue(error);

    await expect(getStoredSessionUseCase.execute()).rejects.toThrow('Storage error');
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
  });
});
