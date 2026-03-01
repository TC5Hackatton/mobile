import { AuthRepository, LoggerRepository, SessionRepository, SettingsRepository, StorageRepository, TaskRepository } from '@/src/domain';
import { AsyncStorageRepository, FirebaseAuthRepository, FirebaseSettingsRepository, FirebaseTaskRepository, InMemoryLoggerRepository, InMemorySessionRepository } from '@/src/infrastructure';
import { createContext, useContext, useMemo } from 'react';

export interface AppDependencies {
  authRepository: AuthRepository;
  taskRepository: TaskRepository;
  logger: LoggerRepository;
  storageRepository: StorageRepository;
  sessionRepository: SessionRepository;
  settingsRepository: SettingsRepository;
}

const DependenciesContext = createContext<AppDependencies | null>(null);

export function DependenciesProvider({ children }: { children: React.ReactNode }) {
  const dependencies = useMemo<AppDependencies>(
    () => {
      const storageRepository = new AsyncStorageRepository();
      const sessionRepository = new InMemorySessionRepository(storageRepository);
      return {
        authRepository: new FirebaseAuthRepository(),
        taskRepository: new FirebaseTaskRepository(),
        logger: new InMemoryLoggerRepository(),
        storageRepository,
        sessionRepository,
        settingsRepository: new FirebaseSettingsRepository(),
      };
    },
    [],
  );

  return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
}

export const useDependencies = () => {
  const dependencies = useContext(DependenciesContext);

  if (!dependencies) {
    throw new Error('useDependencies must be used within DependenciesProvider');
  }

  return dependencies;
};
