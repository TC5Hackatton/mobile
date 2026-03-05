import firebaseConfig from '@/firebaseConfig';
import { Settings, SettingsRepository, type FontSizeScale } from '@/src/domain';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';

const FIELD_MAP: Record<keyof Settings, string> = {
  darkMode: 'appearance.dark_mode',
  fontSize: 'appearance.font_size',
  amountDefault: 'timer.amount_default',
};

// updateDoc accepts dot-notation paths (e.g. 'timer.amount_default') and
// correctly writes nested fields. setDoc does NOT — it stores the key literally.
// This helper converts the flat map to a proper nested object for setDoc.
function toNestedObject(flat: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, Record<string, unknown>> = {};
  for (const [dotPath, value] of Object.entries(flat)) {
    const [parent, child] = dotPath.split('.');
    if (!result[parent]) result[parent] = {};
    result[parent][child] = value;
  }
  return result;
}

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

    const flatPayload = Object.fromEntries(
      fields.map(([key, value]) => [FIELD_MAP[key], value]),
    );

    const ref = doc(firebaseConfig.db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, flatPayload);
    } else {
      await setDoc(ref, toNestedObject(flatPayload));
    }
  }
}
