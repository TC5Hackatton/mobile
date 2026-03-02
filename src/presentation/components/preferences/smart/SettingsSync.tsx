import type { FontSizeScale } from '@/src/presentation/constants/typography';
import { useTheme } from '@/src/presentation/contexts/ThemeContext';
import { useSession } from '@/src/presentation/contexts/SessionContext';
import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';

export function SettingsSync() {
  const { session } = useSession();
  const { fetchSettingsUseCase, setTheme, setFontSizeScale } = useTheme();
  const lastSyncedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!session?.uid) {
      lastSyncedUid.current = null;
      return;
    }
    if (lastSyncedUid.current === session.uid) return;

    const loadAndApply = async () => {
      try {
        const settings = await fetchSettingsUseCase.execute();
        setTheme(settings.darkMode ? 'dark' : 'light');
        setFontSizeScale((settings.fontSize || 'M') as FontSizeScale);
        lastSyncedUid.current = session.uid;
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Falha ao carregar configurações de aparência',
          text2: String(error),
        });
      }
    };

    loadAndApply();
  }, [session?.uid, fetchSettingsUseCase, setTheme, setFontSizeScale]);

  return null;
}
