import { Settings } from '@/src/domain/entities/Settings';
import type { FetchSettingsUseCase, UpdateSettingsUseCase } from '@/src/domain';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { FontSizeScale } from '../constants/typography';

export type ThemeMode = 'light' | 'dark';

const DEFAULT_SETTINGS = Settings.create(false, 'M', 25, false);

export interface ThemeContextValue {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
  fetchSettingsUseCase: FetchSettingsUseCase;
  updateSettingsUseCase: UpdateSettingsUseCase;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const stubFetchSettingsUseCase: FetchSettingsUseCase = {
  execute: async () => DEFAULT_SETTINGS,
};
const stubUpdateSettingsUseCase: UpdateSettingsUseCase = {
  execute: async () => {},
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  fetchSettingsUseCase?: FetchSettingsUseCase;
  updateSettingsUseCase?: UpdateSettingsUseCase;
}

export function ThemeProvider({
  children,
  fetchSettingsUseCase = stubFetchSettingsUseCase,
  updateSettingsUseCase = stubUpdateSettingsUseCase,
}: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>('M');

  const isDark = themeMode === 'dark';

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setFontSizeScale = useCallback((scale: FontSizeScale) => {
    setFontSizeScaleState(scale);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      isDark,
      toggleTheme,
      setTheme,
      fontSizeScale,
      setFontSizeScale,
      fetchSettingsUseCase,
      updateSettingsUseCase,
    }),
    [
      themeMode,
      isDark,
      toggleTheme,
      setTheme,
      fontSizeScale,
      setFontSizeScale,
      fetchSettingsUseCase,
      updateSettingsUseCase,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

export function useFontSizeContext() {
  const { fontSizeScale, setFontSizeScale } = useTheme();
  return { fontSizeScale, setFontSizeScale };
}

export function useSettings() {
  const { fetchSettingsUseCase, updateSettingsUseCase } = useTheme();
  return { fetchSettingsUseCase, updateSettingsUseCase };
}
