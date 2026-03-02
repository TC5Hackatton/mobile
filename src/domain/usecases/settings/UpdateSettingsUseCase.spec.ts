import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SessionRepository } from '../../repositories/SessionRepository';
import { UpdateSettingsUseCase } from './UpdateSettingsUseCase';

describe('UpdateSettingsUseCase', () => {
  let updateSettingsUseCase: UpdateSettingsUseCase;
  let mockSettingsRepository: jest.Mocked<SettingsRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockSettingsRepository = {
      fetch: jest.fn(),
      update: jest.fn(),
    };

    mockSessionRepository = {
      getStoredSession: jest.fn(),
    } as any;

    updateSettingsUseCase = new UpdateSettingsUseCase(mockSessionRepository, mockSettingsRepository);
  });

  it('should call repository update with session uid and partial data', async () => {
    const mockSession = { uid: 'user-456', token: 'token' };
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.update.mockResolvedValue(undefined);

    await updateSettingsUseCase.execute({ darkMode: true });

    expect(mockSettingsRepository.update).toHaveBeenCalledWith('user-456', { darkMode: true });
  });

  it('should not call repository when user is not logged in', async () => {
    mockSessionRepository.getStoredSession.mockResolvedValue(null);

    await updateSettingsUseCase.execute({ fontSize: 'G' });

    expect(mockSettingsRepository.update).not.toHaveBeenCalled();
  });

  it('should pass multiple fields to repository', async () => {
    const mockSession = { uid: 'user-789', token: 'token' };
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.update.mockResolvedValue(undefined);

    await updateSettingsUseCase.execute({
      darkMode: true,
      fontSize: 'P',
      amountDefault: 35,
      pauseReminder: true,
    });

    expect(mockSettingsRepository.update).toHaveBeenCalledWith('user-789', {
      darkMode: true,
      fontSize: 'P',
      amountDefault: 35,
      pauseReminder: true,
    });
  });

  it('should propagate errors from repository', async () => {
    const mockSession = { uid: 'user-123', token: 'token' };
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.update.mockRejectedValue(new Error('Network error'));

    await expect(updateSettingsUseCase.execute({ amountDefault: 25 })).rejects.toThrow('Network error');
  });
});
