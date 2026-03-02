import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import { useSettings } from './SettingsContext';
import { useSession } from './SessionContext';

export interface TimerSettingsState {
  amountDefault: number;
  pauseReminder: boolean;
  isLoading: boolean;
}

interface TimerSettingsContextValue extends TimerSettingsState {
  setAmountDefault: (minutes: number) => void;
  setPauseReminder: (value: boolean) => void;
}

const TimerSettingsContext = createContext<TimerSettingsContextValue | null>(null);

export function TimerSettingsProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const { fetchSettingsUseCase, updateSettingsUseCase } = useSettings();
  const [amountDefault, setAmountDefaultState] = useState(25);
  const [pauseReminder, setPauseReminderState] = useState(false);
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
        setPauseReminderState(settings.pauseReminder);
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

  const setPauseReminder = useCallback(
    (value: boolean) => {
      setPauseReminderState(value);
      if (session?.uid) {
        updateSettingsUseCase.execute({ pauseReminder: value }).catch((err) =>
          Toast.show({
            type: 'error',
            text1: 'Falha ao salvar lembrete de pausa no Firebase',
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
      pauseReminder,
      isLoading,
      setAmountDefault,
      setPauseReminder,
    }),
    [amountDefault, pauseReminder, isLoading, setAmountDefault, setPauseReminder],
  );

  return (
    <TimerSettingsContext.Provider value={value}>{children}</TimerSettingsContext.Provider>
  );
}

export function useTimerSettings() {
  const context = useContext(TimerSettingsContext);

  if (!context) {
    throw new Error('useTimerSettings must be used within TimerSettingsProvider');
  }

  return context;
}
