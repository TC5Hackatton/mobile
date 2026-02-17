import { Session } from '@/src/domain/entities/Session';
import { StorageRepository } from '@/src/domain/repositories/StorageRepository';
import { InMemorySessionRepository } from './InMemorySessionRepository';

describe('InMemorySessionRepository', () => {
  let repository: InMemorySessionRepository;
  let mockStorageRepository: jest.Mocked<StorageRepository>;

  beforeEach(() => {
    mockStorageRepository = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as jest.Mocked<StorageRepository>;

    repository = new InMemorySessionRepository(mockStorageRepository);
  });

  describe('saveSession', () => {
    it('should save session to storage', async () => {
      const session = Session.create('user-123', 'token-abc');
      mockStorageRepository.setItem.mockResolvedValue();

      await repository.saveSession(session);

      expect(mockStorageRepository.setItem).toHaveBeenCalledWith('@session', session.toJSON());
      expect(mockStorageRepository.setItem).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from storage repository', async () => {
      const session = Session.create('user-123', 'token-abc');
      const error = new Error('Storage error');
      mockStorageRepository.setItem.mockRejectedValue(error);

      await expect(repository.saveSession(session)).rejects.toThrow('Storage error');
    });
  });

  describe('getStoredSession', () => {
    it('should retrieve and deserialize stored session', async () => {
      const session = Session.create('user-456', 'token-xyz');
      mockStorageRepository.getItem.mockResolvedValue(session.toJSON());

      const result = await repository.getStoredSession();

      expect(result).toBeInstanceOf(Session);
      expect(result?.uid).toBe('user-456');
      expect(result?.token).toBe('token-xyz');
      expect(mockStorageRepository.getItem).toHaveBeenCalledWith('@session');
    });

    it('should return null when no session is stored', async () => {
      mockStorageRepository.getItem.mockResolvedValue(null);

      const result = await repository.getStoredSession();

      expect(result).toBeNull();
      expect(mockStorageRepository.getItem).toHaveBeenCalledWith('@session');
    });

    it('should return null and clear session when stored data is invalid', async () => {
      mockStorageRepository.getItem.mockResolvedValue('invalid-json');
      mockStorageRepository.removeItem.mockResolvedValue();

      const result = await repository.getStoredSession();

      expect(result).toBeNull();
      expect(mockStorageRepository.removeItem).toHaveBeenCalledWith('@session');
    });

    it('should handle malformed JSON gracefully', async () => {
      mockStorageRepository.getItem.mockResolvedValue('{invalid json}');
      mockStorageRepository.removeItem.mockResolvedValue();

      const result = await repository.getStoredSession();

      expect(result).toBeNull();
      expect(mockStorageRepository.removeItem).toHaveBeenCalled();
    });

    it('should handle JSON missing required fields', async () => {
      mockStorageRepository.getItem.mockResolvedValue('{"uid":"user-only"}');
      mockStorageRepository.removeItem.mockResolvedValue();

      const result = await repository.getStoredSession();

      expect(result).toBeNull();
      expect(mockStorageRepository.removeItem).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('should remove session from storage', async () => {
      mockStorageRepository.removeItem.mockResolvedValue();

      await repository.clearSession();

      expect(mockStorageRepository.removeItem).toHaveBeenCalledWith('@session');
      expect(mockStorageRepository.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from storage repository', async () => {
      const error = new Error('Removal error');
      mockStorageRepository.removeItem.mockRejectedValue(error);

      await expect(repository.clearSession()).rejects.toThrow('Removal error');
    });
  });
});
