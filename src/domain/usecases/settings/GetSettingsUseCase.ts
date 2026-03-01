import { AppearanceSettings } from '../../entities/AppearanceSettings';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SessionRepository } from '../../repositories/SessionRepository';

export class GetSettingsUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private settingsRepository: SettingsRepository,
  ) {}

  async execute(): Promise<AppearanceSettings | null> {
    const session = await this.sessionRepository.getStoredSession();
    if (!session) return null;
    return this.settingsRepository.getSettings(session.uid);
  }
}
