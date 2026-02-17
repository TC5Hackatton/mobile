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
  const { authRepository, taskRepository, sessionRepository } = useDependencies(); // Modified

  const useCases = useMemo<UserUseCases>( // Modified variable name and type
    () => ({
      signUpUseCase: new SignUpUseCase(authRepository), // Order changed
      signInUseCase: new SignInUseCase(authRepository, sessionRepository), // Modified
      forgotPasswordUseCase: new ForgotPasswordUseCase(authRepository),
      createTaskUseCase: new CreateTaskUseCase(sessionRepository, taskRepository), // Added
      fetchAllTasksUseCase: new FetchAllTasksUseCase(taskRepository), // Added
    }),
    [authRepository, taskRepository, sessionRepository], // Modified dependency array
  );

  return <UserContext.Provider value={useCases}>{children}</UserContext.Provider>; // Modified value prop
}

// Custom hook to use auth dependencies
export const useUser = () => {
  const userUseCases = useContext(UserContext);

  if (!userUseCases) {
    throw new Error('useUser must be used within UserProvider');
  }

  return userUseCases;
};
