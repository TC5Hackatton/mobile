import { CreateTaskUseCase, FetchAllTasksUseCase, ForgotPasswordUseCase, SignInUseCase, SignUpUseCase } from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface UserUseCases {
  signInUseCase: SignInUseCase;
  signUpUseCase: SignUpUseCase;
  forgotPasswordUseCase: ForgotPasswordUseCase;
}

// Create a context for Auth dependencies
const UserContext = createContext<UserUseCases | null>(null);

// Component (Provider) that provides auth dependencies instantiated through context
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { authRepository, taskRepository, sessionRepository } = useDependencies();

  const useCases = useMemo<UserUseCases>(
    () => ({
      signUpUseCase: new SignUpUseCase(authRepository),
      signInUseCase: new SignInUseCase(authRepository, sessionRepository),
      forgotPasswordUseCase: new ForgotPasswordUseCase(authRepository),
      createTaskUseCase: new CreateTaskUseCase(sessionRepository, taskRepository),
      fetchAllTasksUseCase: new FetchAllTasksUseCase(taskRepository),
    }),
    [authRepository, taskRepository, sessionRepository],
  );

  return <UserContext.Provider value={useCases}>{children}</UserContext.Provider>;
}

// Custom hook to use auth dependencies
export const useUser = () => {
  const userUseCases = useContext(UserContext);

  if (!userUseCases) {
    throw new Error('useUser must be used within UserProvider');
  }

  return userUseCases;
};
