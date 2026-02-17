import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageRepository } from './AsyncStorageRepository';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AsyncStorageRepository', () => {
  let repository: AsyncStorageRepository;

  beforeEach(() => {
    repository = new AsyncStorageRepository();
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store a string value', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await repository.setItem(key, value);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, value);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should store a value with generic type', async () => {
      const key = 'json-key';
      const value = '{"data": "value"}';

      await repository.setItem<string>(key, value);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should propagate errors from AsyncStorage', async () => {
      const error = new Error('Storage error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await expect(repository.setItem('key', 'value')).rejects.toThrow('Storage error');
    });
  });

  describe('getItem', () => {
    it('should retrieve a stored value', async () => {
      const key = 'test-key';
      const value = 'test-value';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(value);

      const result = await repository.getItem(key);

      expect(result).toBe(value);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await repository.getItem('non-existent-key');

      expect(result).toBeNull();
    });

    it('should retrieve value with generic type', async () => {
      const value = '{"data": "value"}';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(value);

      const result = await repository.getItem<string>('json-key');

      expect(result).toBe(value);
    });

    it('should propagate errors from AsyncStorage', async () => {
      const error = new Error('Retrieval error');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      await expect(repository.getItem('key')).rejects.toThrow('Retrieval error');
    });
  });

  describe('removeItem', () => {
    it('should remove an item by key', async () => {
      const key = 'test-key';

      await repository.removeItem(key);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AsyncStorage', async () => {
      const error = new Error('Removal error');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(error);

      await expect(repository.removeItem('key')).rejects.toThrow('Removal error');
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      await repository.clear();

      expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AsyncStorage', async () => {
      const error = new Error('Clear error');
      (AsyncStorage.clear as jest.Mock).mockRejectedValue(error);

      await expect(repository.clear()).rejects.toThrow('Clear error');
    });
  });
});
