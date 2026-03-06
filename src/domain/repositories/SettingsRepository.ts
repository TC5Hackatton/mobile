import { Settings } from '../entities/Settings';

export interface SettingsRepository {
  fetch(uid: string): Promise<Settings | null>;
  update(uid: string, data: Partial<Settings>): Promise<void>;
}
