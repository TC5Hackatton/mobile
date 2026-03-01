import firebaseConfig from '@/firebaseConfig';
import { AppearanceSettings, SettingsRepository } from '@/src/domain';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';

export class FirebaseSettingsRepository implements SettingsRepository {
  async getSettings(uid: string): Promise<AppearanceSettings | null> {
    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const appearance = data?.appearance;

    if (!appearance || typeof appearance.dark_mode !== 'boolean') return null;

    const fontSize = appearance.font_size;
    const validFontSize = fontSize === 'P' || fontSize === 'M' || fontSize === 'G';

    return {
      dark_mode: appearance.dark_mode,
      font_size: validFontSize ? fontSize : 'M',
      high_contrast: appearance.high_contrast,
    };
  }

  async updateAppearance(uid: string, data: Partial<AppearanceSettings>): Promise<void> {
    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    const existing = snapshot.exists() ? snapshot.data() : {};
    const currentAppearance = (existing?.appearance || {}) as Partial<AppearanceSettings>;

    await setDoc(
      ref,
      {
        appearance: {
          ...currentAppearance,
          ...data,
        },
      },
      { merge: true },
    );
  }
}
