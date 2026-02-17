import { StorageRepository } from '@/src/domain/repositories/StorageRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageRepository implements StorageRepository {
  async setItem<T = string>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, value as string);
  }

  async getItem<T = string>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value as T | null;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}
