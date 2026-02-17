import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = 'mindease_theme_mode';

// Função helper para salvar tema (funciona em web e mobile)
const saveTheme = (mode: ThemeMode) => {
  try {
    // Para web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
    // Para React Native, podemos adicionar AsyncStorage depois se necessário
  } catch (error) {
    // Ignorar erros de storage
    console.warn('Não foi possível salvar o tema:', error);
  }
};

// Função helper para carregar tema
const loadTheme = (): ThemeMode | null => {
  try {
    // Para web
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved as ThemeMode;
      }
    }
  } catch (error) {
    // Ignorar erros
    console.warn('Não foi possível carregar o tema:', error);
  }
  return null;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Carregar tema salvo na inicialização
    const saved = loadTheme();
    return saved || 'light';
  });

  const isDark = themeMode === 'dark';

  const setTheme = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveTheme(mode);
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      isDark,
      toggleTheme,
      setTheme,
    }),
    [themeMode, isDark],
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
