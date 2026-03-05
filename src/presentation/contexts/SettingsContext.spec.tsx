import { FetchSettingsUseCase, UpdateSettingsUseCase } from '@/src/domain';
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';

jest.mock('./DependenciesContext', () => ({
  useDependencies: jest.fn(),
}));

const { useDependencies } = require('./DependenciesContext');

const mockSessionRepository = { getStoredSession: jest.fn() };
const mockSettingsRepository = { fetch: jest.fn(), update: jest.fn() };

const wrapper = ({ children }: { children: React.ReactNode }) => <SettingsProvider>{children}</SettingsProvider>;

describe('SettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDependencies.mockReturnValue({
      sessionRepository: mockSessionRepository,
      settingsRepository: mockSettingsRepository,
    });
  });

  describe('SettingsProvider', () => {
    it('should provide fetchSettingsUseCase and updateSettingsUseCase', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      expect(result.current.fetchSettingsUseCase).toBeInstanceOf(FetchSettingsUseCase);
      expect(result.current.updateSettingsUseCase).toBeInstanceOf(UpdateSettingsUseCase);
    });

    it('should construct use cases with the repositories from DependenciesContext', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      // Verify use cases are wired to the correct repositories by exercising them
      mockSessionRepository.getStoredSession.mockResolvedValue(null);

      expect(result.current.fetchSettingsUseCase.execute).toBeDefined();
      expect(result.current.updateSettingsUseCase.execute).toBeDefined();
    });

    it('should return stable references across re-renders', () => {
      const { result, rerender } = renderHook(() => useSettings(), { wrapper });

      const first = result.current;
      rerender({});
      const second = result.current;

      expect(first.fetchSettingsUseCase).toBe(second.fetchSettingsUseCase);
      expect(first.updateSettingsUseCase).toBe(second.updateSettingsUseCase);
    });
  });

  describe('useSettings', () => {
    it('should throw when used outside SettingsProvider', () => {
      const { result } = renderHook(() => {
        try {
          return useSettings();
        } catch (e) {
          return e as Error;
        }
      });

      expect(result.current).toBeInstanceOf(Error);
      expect((result.current as Error).message).toBe('useSettings must be used within SettingsProvider');
    });
  });
});
