import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FontSizeScale } from '../constants/typography';

interface FontSizeContextValue {
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

const FONT_SIZE_STORAGE_KEY = 'mindease_font_size_scale';

const saveFontSizeScale = (scale: FontSizeScale) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, scale);
    }
  } catch (error) {
    // Ignorar erros de storage
    console.warn('Não foi possível salvar a escala de fonte:', error);
  }
};

const loadFontSizeScale = (): FontSizeScale | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved === 'P' || saved === 'M' || saved === 'G') {
        return saved as FontSizeScale;
      }
    }
  } catch (error) {
    console.warn('Não foi possível carregar a escala de fonte:', error);
  }
  return null;
};

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>(() => {
    const saved = loadFontSizeScale();
    return saved || 'M';
  });

  const setFontSizeScale = useCallback((scale: FontSizeScale) => {
    setFontSizeScaleState(scale);
    saveFontSizeScale(scale);
  }, []);

  const value = useMemo<FontSizeContextValue>(
    () => ({
      fontSizeScale,
      setFontSizeScale,
    }),
    [fontSizeScale, setFontSizeScale]
  );

  return <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>;
}

export function useFontSizeContext() {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error('useFontSizeContext must be used within FontSizeProvider');
  }

  return context;
}
