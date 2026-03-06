import { Settings } from '../../entities/Settings';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SessionRepository } from '../../repositories/SessionRepository';

export class UpdateSettingsUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private settingsRepository: SettingsRepository,
  ) {}

  async execute(data: Partial<Settings>): Promise<void> {
    const session = await this.sessionRepository.getStoredSession();
    if (!session) return;
    await this.settingsRepository.update(session.uid, data);
  }
}
