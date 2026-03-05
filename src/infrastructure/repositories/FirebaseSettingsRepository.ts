import firebaseConfig from '@/firebaseConfig';
import { Settings, SettingsRepository, type FontSizeScale } from '@/src/domain';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';

const FIELD_MAP: Record<keyof Settings, string> = {
  darkMode: 'appearance.dark_mode',
  fontSize: 'appearance.font_size',
  amountDefault: 'timer.amount_default',
};

export class FirebaseSettingsRepository implements SettingsRepository {
  async fetch(uid: string): Promise<Settings | null> {
    const snapshot = await getDoc(doc(firebaseConfig.db, SETTINGS_COLLECTION, uid));

    if (!snapshot.exists()) return null;

    const { appearance = {}, timer = {} } = snapshot.data();

    return Settings.create(
      appearance.dark_mode ?? false,
      (appearance.font_size as FontSizeScale) ?? 'M',
      timer.amount_default ?? 25,
    );
  }

  async update(uid: string, data: Partial<Settings>): Promise<void> {
    const fields = Object.entries(data) as [keyof Settings, unknown][];
    if (fields.length === 0) return;

    const payload = Object.fromEntries(
      fields.map(([key, value]) => [FIELD_MAP[key], value]),
    );

    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, payload);
    } else {
      await setDoc(ref, payload);
    }
  }
}
