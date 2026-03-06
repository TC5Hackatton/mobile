import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import { useSession } from './SessionContext';
import { useSettings } from './SettingsContext';

export interface TimerSettingsState {
  amountDefault: number;
  isLoading: boolean;
}

interface TimerSettingsContextValue extends TimerSettingsState {
  setAmountDefault: (minutes: number) => void;
}

const TimerSettingsContext = createContext<TimerSettingsContextValue | null>(null);

export function TimerSettingsProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const { fetchSettingsUseCase, updateSettingsUseCase } = useSettings();
  const [amountDefault, setAmountDefaultState] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.uid) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const settings = await fetchSettingsUseCase.execute();
        setAmountDefaultState(settings.amountDefault);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Falha ao carregar configurações do timer',
          text2: String(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [session?.uid, fetchSettingsUseCase]);

  const setAmountDefault = useCallback(
    (minutes: number) => {
      setAmountDefaultState(minutes);
      if (session?.uid) {
        updateSettingsUseCase.execute({ amountDefault: minutes }).catch((err) =>
          Toast.show({
            type: 'error',
            text1: 'Falha ao salvar tempo padrão no Firebase',
            text2: String(err),
          }),
        );
      }
    },
    [session?.uid, updateSettingsUseCase],
  );

  const value = useMemo<TimerSettingsContextValue>(
    () => ({
      amountDefault,
      isLoading,
      setAmountDefault,
    }),
    [amountDefault, isLoading, setAmountDefault],
  );

  return <TimerSettingsContext.Provider value={value}>{children}</TimerSettingsContext.Provider>;
}

export function useTimerSettings() {
  const context = useContext(TimerSettingsContext);

  if (!context) {
    throw new Error('useTimerSettings must be used within TimerSettingsProvider');
  }

  return context;
}
