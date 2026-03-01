import { AppearanceSettings } from '../entities/AppearanceSettings';

export interface SettingsRepository {
  getSettings(uid: string): Promise<AppearanceSettings | null>;
  updateAppearance(uid: string, data: Partial<AppearanceSettings>): Promise<void>;
}
