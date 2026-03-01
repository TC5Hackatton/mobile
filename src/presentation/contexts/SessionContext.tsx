import { GetStoredSessionUseCase, SignOutUseCase } from '@/src/domain';
import { Session } from '@/src/domain/entities/Session';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDependencies } from './DependenciesContext';

export interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { authRepository, sessionRepository } = useDependencies();

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Instantiate use cases
  const useCases = useMemo(
    () => ({
      getStoredSessionUseCase: new GetStoredSessionUseCase(sessionRepository),
      signOutUseCase: new SignOutUseCase(authRepository, sessionRepository),
    }),
    [authRepository, sessionRepository],
  );

  // Auto-restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedSession = await useCases.getStoredSessionUseCase.execute();
        if (storedSession) {
          setSession(storedSession);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [useCases.getStoredSessionUseCase]);

  const clearSession = useCallback(async () => {
    await useCases.signOutUseCase.execute();
    setSession(null);
  }, [useCases.signOutUseCase]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isAuthenticated: !!session,
      isLoading,
      setSession,
      clearSession,
    }),
    [session, isLoading, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
};
