import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('ThemeProvider initial state', () => {
    it('should start with light theme when no theme is saved', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should restore dark theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should restore light theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should fall back to light when localStorage has invalid value', () => {
      localStorageMock.getItem.mockReturnValue('invalid-value');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should toggle from dark to light', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should save new theme to localStorage after toggle', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('mindease_theme_mode', 'dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.themeMode).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should set theme to light', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.themeMode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should save theme to localStorage when set', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('mindease_theme_mode', 'dark');
    });
  });

  describe('useTheme error handling', () => {
    it('should throw when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleError.mockRestore();
    });
  });
});
