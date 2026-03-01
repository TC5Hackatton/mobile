import { GetSettingsUseCase, UpdateAppearanceUseCase } from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface SettingsUseCases {
  getSettingsUseCase: GetSettingsUseCase;
  updateAppearanceUseCase: UpdateAppearanceUseCase;
}

const SettingsContext = createContext<SettingsUseCases | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { sessionRepository, settingsRepository } = useDependencies();

  const useCases = useMemo<SettingsUseCases>(
    () => ({
      getSettingsUseCase: new GetSettingsUseCase(sessionRepository, settingsRepository),
      updateAppearanceUseCase: new UpdateAppearanceUseCase(sessionRepository, settingsRepository),
    }),
    [sessionRepository, settingsRepository],
  );

  return <SettingsContext.Provider value={useCases}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
};
