import { Settings } from '../../entities/Settings';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SessionRepository } from '../../repositories/SessionRepository';
import { FetchSettingsUseCase } from './FetchSettingsUseCase';

describe('FetchSettingsUseCase', () => {
  let fetchSettingsUseCase: FetchSettingsUseCase;
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

    fetchSettingsUseCase = new FetchSettingsUseCase(mockSessionRepository, mockSettingsRepository);
  });

  it('should return settings from repository when user is logged in', async () => {
    const mockSession = { uid: 'user-123', token: 'token' };
    const mockSettings = Settings.create(true, 'G', 35, true);

    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.fetch.mockResolvedValue(mockSettings);

    const result = await fetchSettingsUseCase.execute();

    expect(mockSettingsRepository.fetch).toHaveBeenCalledWith('user-123');
    expect(result).toBe(mockSettings);
    expect(result.darkMode).toBe(true);
    expect(result.fontSize).toBe('G');
    expect(result.amountDefault).toBe(35);
    expect(result.pauseReminder).toBe(true);
  });

  it('should return default settings when user is not logged in', async () => {
    mockSessionRepository.getStoredSession.mockResolvedValue(null);

    const result = await fetchSettingsUseCase.execute();

    expect(mockSettingsRepository.fetch).not.toHaveBeenCalled();
    expect(result.darkMode).toBe(false);
    expect(result.fontSize).toBe('M');
    expect(result.amountDefault).toBe(25);
    expect(result.pauseReminder).toBe(false);
  });

  it('should return default settings when repository returns null', async () => {
    const mockSession = { uid: 'user-123', token: 'token' };
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.fetch.mockResolvedValue(null);

    const result = await fetchSettingsUseCase.execute();

    expect(mockSettingsRepository.fetch).toHaveBeenCalledWith('user-123');
    expect(result.darkMode).toBe(false);
    expect(result.fontSize).toBe('M');
    expect(result.amountDefault).toBe(25);
    expect(result.pauseReminder).toBe(false);
  });

  it('should propagate errors from repository', async () => {
    const mockSession = { uid: 'user-123', token: 'token' };
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession as any);
    mockSettingsRepository.fetch.mockRejectedValue(new Error('Database error'));

    await expect(fetchSettingsUseCase.execute()).rejects.toThrow('Database error');
  });
});
