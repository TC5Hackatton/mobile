import { CreateUserUseCase, SignInUserUseCase } from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface UserUseCases {
  createUserUseCase: CreateUserUseCase;
  signInUserUseCase: SignInUserUseCase;
}

// Create a context for Auth dependencies
const UserContext = createContext<UserUseCases | null>(null);

// Component (Provider) that provides auth dependencies instantiated through context
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { authRepository } = useDependencies();

  const userUseCases = useMemo<UserUseCases>(
    () => ({
      createUserUseCase: new CreateUserUseCase(authRepository),
      signInUserUseCase: new SignInUserUseCase(authRepository),
    }),
    [authRepository],
  );

  return <UserContext.Provider value={userUseCases}>{children}</UserContext.Provider>;
}

// Custom hook to use auth dependencies
export const useUser = () => {
  const userUseCases = useContext(UserContext);

  if (!userUseCases) {
    throw new Error('useUser must be used within UserProvider');
  }

  return userUseCases;
};
