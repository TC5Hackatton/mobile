import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { customColors } from '../constants/paper-theme';

/**
 * Hook que retorna as cores apropriadas baseadas no tema atual (light/dark)
 */
export function useThemeColors() {
  const { isDark } = useTheme();

  return useMemo(() => {
    if (isDark) {
      return {
        // Cores de fundo
        background: customColors.darkNavy,
        surface: customColors.darkSurface,
        surfaceVariant: customColors.darkBlueGray,
        
        // Cores de texto
        text: customColors.darkText,
        textSecondary: customColors.darkTextSecondary,
        textOnPrimary: customColors.darkNavy,
        
        // Cores primárias
        primary: customColors.lightBlue,
        secondary: customColors.mintTeal,
        tertiary: customColors.mintTeal,
        
        // Cores de UI
        border: customColors.darkBorder,
        divider: customColors.darkBorder,
        error: customColors.coral,
        
        // Cores específicas
        white: customColors.white,
        gray: customColors.gray,
        mediumGray: customColors.mediumGray,
        lightGray: customColors.lightGray,
        coral: customColors.coral,
        lightGreen: customColors.lightGreen,
        yellow: customColors.yellow,
        skyBlue: customColors.lightBlue, // No modo escuro, usar lightBlue
        mediumBlue: customColors.lightBlue, // No modo escuro, usar lightBlue
        tealGreen: customColors.mintTeal, // No modo escuro, usar mintTeal
        mintTeal: customColors.mintTeal, // Mantendo cor original
        
        // Cores de navegação
        tabBarBackground: customColors.darkNavy,
        tabBarActive: customColors.lightBlue,
        tabBarInactive: customColors.darkTextSecondary,
        tabBarBorder: customColors.darkBorder,
      };
    } else {
      return {
        // Cores de fundo
        background: customColors.lightGray,
        surface: customColors.white,
        surfaceVariant: customColors.veryLightGray,
        
        // Cores de texto
        text: customColors.darkNavy,
        textSecondary: customColors.mediumGray,
        textOnPrimary: customColors.white,
        
        // Cores primárias (mantendo as originais do tema claro)
        primary: customColors.mediumBlue,
        secondary: customColors.mintTealLight, // #9ACA69 no modo claro
        tertiary: customColors.skyBlueLight, // #6B9BD0 no modo claro
        
        // Cores de UI
        border: customColors.skyBlueLight, // #6B9BD0 no modo claro
        divider: customColors.lightGray,
        error: customColors.coral,
        
        // Cores específicas (mantendo as originais do tema claro)
        white: customColors.white,
        gray: customColors.gray,
        mediumGray: customColors.mediumGray,
        lightGray: customColors.lightGray,
        coral: customColors.coral,
        lightGreen: customColors.lightGreen,
        yellow: customColors.yellow,
        skyBlue: customColors.skyBlueLight, // #6B9BD0 no modo claro
        mediumBlue: customColors.mediumBlue, // Mantendo cor original
        tealGreen: customColors.tealGreen, // Mantendo cor original
        mintTeal: customColors.mintTealLight, // #9ACA69 no modo claro
        
        // Cores de navegação
        tabBarBackground: customColors.white,
        tabBarActive: customColors.coral,
        tabBarInactive: customColors.mediumGray,
        tabBarBorder: customColors.lightGray,
      };
    }
  }, [isDark]);
}
