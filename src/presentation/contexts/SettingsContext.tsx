import { FetchSettingsUseCase, UpdateSettingsUseCase } from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface SettingsUseCases {
  fetchSettingsUseCase: FetchSettingsUseCase;
  updateSettingsUseCase: UpdateSettingsUseCase;
}

// Create a context for Settings dependencies
const SettingsContext = createContext<SettingsUseCases | null>(null);

// Component (Provider) that provides Settings use cases instantiated through context
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { sessionRepository, settingsRepository } = useDependencies();

  const settingsUseCases = useMemo<SettingsUseCases>(
    () => ({
      fetchSettingsUseCase: new FetchSettingsUseCase(sessionRepository, settingsRepository),
      updateSettingsUseCase: new UpdateSettingsUseCase(sessionRepository, settingsRepository),
    }),
    [sessionRepository, settingsRepository],
  );

  return <SettingsContext.Provider value={settingsUseCases}>{children}</SettingsContext.Provider>;
}

// Custom hook to use settings dependencies
export const useSettings = () => {
  const settingsUseCases = useContext(SettingsContext);

  if (!settingsUseCases) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return settingsUseCases;
};
