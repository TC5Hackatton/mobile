export interface StorageRepository {
  setItem<T = string>(key: string, value: T): Promise<void>;
  getItem<T = string>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
