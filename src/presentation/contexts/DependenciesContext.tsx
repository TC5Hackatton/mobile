import { AuthRepository, LoggerRepository, SessionRepository, StorageRepository, TaskRepository } from '@/src/domain';
import { AsyncStorageRepository, FirebaseAuthRepository, FirebaseTaskRepository, InMemoryLoggerRepository, InMemorySessionRepository } from '@/src/infrastructure';
import { createContext, useContext, useMemo } from 'react';

export interface AppDependencies {
  authRepository: AuthRepository;
  taskRepository: TaskRepository;
  logger: LoggerRepository;
  storageRepository: StorageRepository;
  sessionRepository: SessionRepository;
}

// Create a context for all the app dependencies
const DependenciesContext = createContext<AppDependencies | null>(null);

// Component (Provider) that provides all the dependencies instantiated through context
export function DependenciesProvider({ children }: { children: React.ReactNode }) {
  // NOTE: useMemo is essential here to avoid re-instantiating the dependencies on every render
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
      };
    },
    [],
  );

  return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
}

// Custom hook to use all the dependencies
export const useDependencies = () => {
  const dependencies = useContext(DependenciesContext);

  if (!dependencies) {
    throw new Error('useDependencies must be used within DependenciesProvider');
  }

  return dependencies;
};
