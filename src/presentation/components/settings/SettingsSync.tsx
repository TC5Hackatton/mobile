import type { FontSizeScale } from '@/src/presentation/constants/typography';
import { useFontSizeContext } from '@/src/presentation/contexts/FontSizeContext';
import { useSession } from '@/src/presentation/contexts/SessionContext';
import { useSettings } from '@/src/presentation/contexts/SettingsContext';
import { useTheme } from '@/src/presentation/contexts/ThemeContext';
import { useEffect, useRef } from 'react';


export function SettingsSync() {
  const { session } = useSession();
  const { getSettingsUseCase } = useSettings();
  const { setTheme } = useTheme();
  const { setFontSizeScale } = useFontSizeContext();
  const lastSyncedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!session?.uid) {
      lastSyncedUid.current = null;
      return;
    }
    if (lastSyncedUid.current === session.uid) return;

    const loadAndApply = async () => {
      try {
        const settings = await getSettingsUseCase.execute();
        if (settings) {
          setTheme(settings.dark_mode ? 'dark' : 'light');
          setFontSizeScale((settings.font_size || 'M') as FontSizeScale);
        }
        lastSyncedUid.current = session.uid;
      } catch (error) {
        console.warn('Falha ao carregar configurações de aparência:', error);
      }
    };

    loadAndApply();
  }, [session?.uid, getSettingsUseCase, setTheme, setFontSizeScale]);

  return null;
}
