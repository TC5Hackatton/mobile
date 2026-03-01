import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { Session } from '@/src/domain/entities/Session';
import { AuthRepository } from '@/src/domain/repositories/AuthRepository';
import { SessionRepository } from '@/src/domain/repositories/SessionRepository';

// Mock DependenciesContext
jest.mock('./DependenciesContext', () => ({
  useDependencies: jest.fn(),
}));

// Mock use cases
jest.mock('@/src/domain', () => ({
  GetStoredSessionUseCase: jest.fn(),
  SignOutUseCase: jest.fn(),
}));

import { GetStoredSessionUseCase, SignOutUseCase } from '@/src/domain';
import { useDependencies } from './DependenciesContext';
import { SessionProvider, useSession } from './SessionContext';

const mockUseDependencies = useDependencies as jest.MockedFunction<typeof useDependencies>;
const MockGetStoredSessionUseCase = GetStoredSessionUseCase as jest.Mock;
const MockSignOutUseCase = SignOutUseCase as jest.Mock;

const buildWrapper = () => {
  const mockGetStoredSession = { execute: jest.fn() };
  const mockSignOut = { execute: jest.fn() };

  MockGetStoredSessionUseCase.mockImplementation(() => mockGetStoredSession);
  MockSignOutUseCase.mockImplementation(() => mockSignOut);

  const mockAuthRepository = {} as jest.Mocked<AuthRepository>;
  const mockSessionRepository = {} as jest.Mocked<SessionRepository>;

  mockUseDependencies.mockReturnValue({
    authRepository: mockAuthRepository,
    taskRepository: {} as any,
    logger: {} as any,
    storageRepository: {} as any,
    sessionRepository: mockSessionRepository,
    settingsRepository: {} as any,
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>{children}</SessionProvider>
  );

  return { wrapper, mockGetStoredSession, mockSignOut };
};

describe('SessionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SessionProvider initial state', () => {
    it('should start loading and with null session', async () => {
      const { wrapper, mockGetStoredSession } = buildWrapper();
      mockGetStoredSession.execute.mockResolvedValue(null);

      const { result } = renderHook(() => useSession(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('should restore session from storage on mount', async () => {
      const { wrapper, mockGetStoredSession } = buildWrapper();
      const storedSession = Session.create('user-123', 'token-abc');
      mockGetStoredSession.execute.mockResolvedValue(storedSession);

      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.session).toBe(storedSession);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should remain unauthenticated when no session stored', async () => {
      const { wrapper, mockGetStoredSession } = buildWrapper();
      mockGetStoredSession.execute.mockResolvedValue(null);

      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should finish loading even when getStoredSession fails', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { wrapper, mockGetStoredSession } = buildWrapper();
      mockGetStoredSession.execute.mockRejectedValue(new Error('Storage unavailable'));

      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      consoleError.mockRestore();
    });
  });

  describe('setSession', () => {
    it('should update session and isAuthenticated when session is set', async () => {
      const { wrapper, mockGetStoredSession } = buildWrapper();
      mockGetStoredSession.execute.mockResolvedValue(null);

      const { result } = renderHook(() => useSession(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const newSession = Session.create('user-456', 'token-xyz');

      act(() => {
        result.current.setSession(newSession);
      });

      expect(result.current.session).toBe(newSession);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear session when null is passed to setSession', async () => {
      const { wrapper, mockGetStoredSession } = buildWrapper();
      const storedSession = Session.create('user-123', 'token-abc');
      mockGetStoredSession.execute.mockResolvedValue(storedSession);

      const { result } = renderHook(() => useSession(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setSession(null);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('should call signOutUseCase and clear the session', async () => {
      const { wrapper, mockGetStoredSession, mockSignOut } = buildWrapper();
      const storedSession = Session.create('user-123', 'token-abc');
      mockGetStoredSession.execute.mockResolvedValue(storedSession);
      mockSignOut.execute.mockResolvedValue(undefined);

      const { result } = renderHook(() => useSession(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.clearSession();
      });

      expect(mockSignOut.execute).toHaveBeenCalledTimes(1);
      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useSession error handling', () => {
    it('should throw when used outside SessionProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSession());
      }).toThrow('useSession must be used within SessionProvider');

      consoleError.mockRestore();
    });
  });
});
