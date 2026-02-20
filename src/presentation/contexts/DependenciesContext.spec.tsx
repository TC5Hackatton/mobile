import { renderHook } from '@testing-library/react-native';
import React from 'react';

// Mock all infrastructure dependencies
jest.mock('@/src/infrastructure', () => ({
  AsyncStorageRepository: jest.fn().mockImplementation(() => ({})),
  FirebaseAuthRepository: jest.fn().mockImplementation(() => ({})),
  FirebaseTaskRepository: jest.fn().mockImplementation(() => ({})),
  InMemoryLoggerRepository: jest.fn().mockImplementation(() => ({})),
  InMemorySessionRepository: jest.fn().mockImplementation(() => ({})),
}));

import { DependenciesProvider, useDependencies } from './DependenciesContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DependenciesProvider>{children}</DependenciesProvider>
);

describe('DependenciesContext', () => {
  describe('DependenciesProvider', () => {
    it('should provide all required dependencies', () => {
      const { result } = renderHook(() => useDependencies(), { wrapper });

      expect(result.current.authRepository).toBeDefined();
      expect(result.current.taskRepository).toBeDefined();
      expect(result.current.logger).toBeDefined();
      expect(result.current.storageRepository).toBeDefined();
      expect(result.current.sessionRepository).toBeDefined();
    });

    it('should instantiate dependencies only once (memoized)', () => {
      const { result, rerender } = renderHook(() => useDependencies(), { wrapper });

      const firstDeps = result.current;
      rerender({});
      const secondDeps = result.current;

      expect(firstDeps).toBe(secondDeps);
    });

    it('should provide stable authRepository reference', () => {
      const { result, rerender } = renderHook(() => useDependencies(), { wrapper });

      const firstRepo = result.current.authRepository;
      rerender({});

      expect(result.current.authRepository).toBe(firstRepo);
    });

    it('should provide stable taskRepository reference', () => {
      const { result, rerender } = renderHook(() => useDependencies(), { wrapper });

      const firstRepo = result.current.taskRepository;
      rerender({});

      expect(result.current.taskRepository).toBe(firstRepo);
    });

    it('should provide stable sessionRepository reference', () => {
      const { result, rerender } = renderHook(() => useDependencies(), { wrapper });

      const firstRepo = result.current.sessionRepository;
      rerender({});

      expect(result.current.sessionRepository).toBe(firstRepo);
    });
  });

  describe('useDependencies error handling', () => {
    it('should throw error when used outside DependenciesProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useDependencies());
      }).toThrow('useDependencies must be used within DependenciesProvider');

      consoleError.mockRestore();
    });
  });
});
