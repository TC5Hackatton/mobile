import { renderHook } from '@testing-library/react-native';
import React from 'react';

// Mock DependenciesContext
jest.mock('./DependenciesContext', () => ({
  useDependencies: jest.fn(),
}));

// Mock domain use cases
jest.mock('@/src/domain', () => ({
  SignInUseCase: jest.fn(),
  SignUpUseCase: jest.fn(),
  ForgotPasswordUseCase: jest.fn(),
  CreateTaskUseCase: jest.fn(),
  FetchAllTasksUseCase: jest.fn(),
}));

import {
    CreateTaskUseCase,
    FetchAllTasksUseCase,
    ForgotPasswordUseCase,
    SignInUseCase,
    SignUpUseCase,
} from '@/src/domain';
import { useDependencies } from './DependenciesContext';
import { UserProvider, useUser } from './UserContext';

const mockUseDependencies = useDependencies as jest.MockedFunction<typeof useDependencies>;
const MockSignInUseCase = SignInUseCase as jest.Mock;
const MockSignUpUseCase = SignUpUseCase as jest.Mock;
const MockForgotPasswordUseCase = ForgotPasswordUseCase as jest.Mock;
const MockCreateTaskUseCase = CreateTaskUseCase as jest.Mock;
const MockFetchAllTasksUseCase = FetchAllTasksUseCase as jest.Mock;

const buildWrapper = () => {
  MockSignInUseCase.mockImplementation(() => ({ execute: jest.fn() }));
  MockSignUpUseCase.mockImplementation(() => ({ execute: jest.fn() }));
  MockForgotPasswordUseCase.mockImplementation(() => ({ execute: jest.fn() }));
  MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));
  MockFetchAllTasksUseCase.mockImplementation(() => ({ execute: jest.fn() }));

  mockUseDependencies.mockReturnValue({
    authRepository: {} as any,
    taskRepository: {} as any,
    logger: {} as any,
    storageRepository: {} as any,
    sessionRepository: {} as any,
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  return { wrapper };
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UserProvider', () => {
    it('should provide signInUseCase', () => {
      const { wrapper } = buildWrapper();

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.signInUseCase).toBeDefined();
    });

    it('should provide signUpUseCase', () => {
      const { wrapper } = buildWrapper();

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.signUpUseCase).toBeDefined();
    });

    it('should provide forgotPasswordUseCase', () => {
      const { wrapper } = buildWrapper();

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.forgotPasswordUseCase).toBeDefined();
    });

    it('should provide stable use case references on re-render (memoized)', () => {
      const { wrapper } = buildWrapper();

      const { result, rerender } = renderHook(() => useUser(), { wrapper });

      const firstResult = result.current;
      rerender({});

      expect(result.current.signInUseCase).toBe(firstResult.signInUseCase);
      expect(result.current.signUpUseCase).toBe(firstResult.signUpUseCase);
      expect(result.current.forgotPasswordUseCase).toBe(firstResult.forgotPasswordUseCase);
    });

    it('should instantiate SignInUseCase with authRepository and sessionRepository', () => {
      const mockDeps = {
        authRepository: { id: 'auth-repo' } as any,
        taskRepository: { id: 'task-repo' } as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: { id: 'session-repo' } as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);
      MockSignInUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockSignUpUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockForgotPasswordUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockFetchAllTasksUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <UserProvider>{children}</UserProvider>
      );

      renderHook(() => useUser(), { wrapper });

      expect(MockSignInUseCase).toHaveBeenCalledWith(
        mockDeps.authRepository,
        mockDeps.sessionRepository,
      );
    });

    it('should instantiate SignUpUseCase with authRepository', () => {
      const mockDeps = {
        authRepository: { id: 'auth-repo' } as any,
        taskRepository: {} as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: {} as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);
      MockSignInUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockSignUpUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockForgotPasswordUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockFetchAllTasksUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <UserProvider>{children}</UserProvider>
      );

      renderHook(() => useUser(), { wrapper });

      expect(MockSignUpUseCase).toHaveBeenCalledWith(mockDeps.authRepository);
    });

    it('should instantiate ForgotPasswordUseCase with authRepository', () => {
      const mockDeps = {
        authRepository: { id: 'auth-repo' } as any,
        taskRepository: {} as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: {} as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);
      MockSignInUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockSignUpUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockForgotPasswordUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockFetchAllTasksUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <UserProvider>{children}</UserProvider>
      );

      renderHook(() => useUser(), { wrapper });

      expect(MockForgotPasswordUseCase).toHaveBeenCalledWith(mockDeps.authRepository);
    });
  });

  describe('useUser error handling', () => {
    it('should throw when used outside UserProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useUser());
      }).toThrow('useUser must be used within UserProvider');

      consoleError.mockRestore();
    });
  });
});
