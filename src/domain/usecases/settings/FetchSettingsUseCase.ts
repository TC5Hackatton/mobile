import { Settings } from '../../entities/Settings';
import { SessionRepository } from '../../repositories/SessionRepository';
import { SettingsRepository } from '../../repositories/SettingsRepository';

const DEFAULT_SETTINGS = Settings.create(false, 'M', 25);

export class FetchSettingsUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private settingsRepository: SettingsRepository,
  ) { }

  async execute(): Promise<Settings> {
    const session = await this.sessionRepository.getStoredSession();
    if (!session) return DEFAULT_SETTINGS;

    const settings = await this.settingsRepository.fetch(session.uid);
    return settings ?? DEFAULT_SETTINGS;
  }
}
