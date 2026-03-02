import firebaseConfig from '@/firebaseConfig';
import { Settings, type FontSizeScale, SettingsRepository } from '@/src/domain';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';

export class FirebaseSettingsRepository implements SettingsRepository {
  async fetch(uid: string): Promise<Settings | null> {
    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const appearance = data?.appearance ?? {};
    const timer = data?.timer ?? {};

    return Settings.create(
      appearance.dark_mode ?? false,
      (appearance.font_size as FontSizeScale) ?? 'M',
      timer.amount_default ?? 25,
      timer.pause_reminder ?? false,
    );
  }

  async update(uid: string, data: Partial<Settings>): Promise<void> {
    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    const existing = snapshot.exists() ? snapshot.data() : {};
    const currentAppearance = existing?.appearance ?? {};
    const currentTimer = existing?.timer ?? {};

    const update: Record<string, unknown> = {};
    const hasAppearanceUpdate = data.darkMode !== undefined || data.fontSize !== undefined;
    const hasTimerUpdate = data.amountDefault !== undefined || data.pauseReminder !== undefined;

    if (hasAppearanceUpdate) {
      const appearanceUpdate: Record<string, unknown> = { ...currentAppearance };
      if (data.darkMode !== undefined) appearanceUpdate.dark_mode = data.darkMode;
      if (data.fontSize !== undefined) appearanceUpdate.font_size = data.fontSize;
      update.appearance = appearanceUpdate;
    }
    if (hasTimerUpdate) {
      const timerUpdate: Record<string, unknown> = { ...currentTimer };
      if (data.amountDefault !== undefined) timerUpdate.amount_default = data.amountDefault;
      if (data.pauseReminder !== undefined) timerUpdate.pause_reminder = data.pauseReminder;
      update.timer = timerUpdate;
    }

    if (Object.keys(update).length === 0) return;

    await setDoc(ref, update, { merge: true });
  }
}
