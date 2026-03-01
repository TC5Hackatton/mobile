import { AppearanceSettings } from '../../entities/AppearanceSettings';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SessionRepository } from '../../repositories/SessionRepository';

export class UpdateAppearanceUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private settingsRepository: SettingsRepository,
  ) {}

  async execute(data: Partial<AppearanceSettings>): Promise<void> {
    const session = await this.sessionRepository.getStoredSession();
    if (!session) return;
    await this.settingsRepository.updateAppearance(session.uid, data);
  }
}
