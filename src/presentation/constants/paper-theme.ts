import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Cores customizadas
export const customColors = {
  lightGray: '#F7F8FA',
  mediumGray: '#707070',
  veryLightGray: '#FAFBFC',
  darkNavy: '#1A1F2E', // Cor padrão de fundo do modo escuro
  lightBlue: '#A8C5E0', // Cor do modo escuro
  mintTeal: '#9BC4BC', // Cor do modo escuro
  darkBlueGray: '#2C3E50',
  mediumBlue: '#5B8DBE',
  gray: '#6B7280',
  skyBlue: '#6B9BD1',
  skyBlueLight: '#6B9BD0', // Cor para modo claro (similar ao skyBlue mas específica)
  teal: '#81C3B4',
  tealGreen: '#7AB8A8',
  mintTealLight: '#9ACA69', // Cor para modo claro (no lugar de mintTeal)
  yellow: '#F5D06C',
  coral: '#E89B8C',
  lightGreen: '#A8DBA8',
  white: '#FFFFFF',
  // Cores adicionais para modo escuro com acessibilidade (WCAG AA)
  darkSurface: '#252B3A', // Superfície escura com contraste adequado
  darkText: '#E8EDF3', // Texto claro para modo escuro (contraste 4.5:1+)
  darkTextSecondary: '#B8C5D0', // Texto secundário para modo escuro
  darkBorder: '#3A4554', // Bordas para modo escuro
};

// Tema claro customizado
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: customColors.mediumBlue,
    secondary: customColors.mintTealLight, // #9ACA69 no modo claro
    tertiary: customColors.skyBlueLight, // #6B9BD0 no modo claro
    background: customColors.lightGray,
    surface: customColors.white,
    surfaceVariant: customColors.veryLightGray,
    error: customColors.coral,
    onPrimary: customColors.white,
    onSecondary: customColors.white,
    onTertiary: customColors.white,
    onBackground: customColors.darkNavy,
    onSurface: customColors.darkNavy,
    onSurfaceVariant: customColors.mediumGray,
    onError: customColors.white,
    outline: customColors.gray,
    outlineVariant: customColors.skyBlueLight, // #6B9BD0 no modo claro
    // Cores customizadas adicionais
    custom: customColors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      ...MD3LightTheme.fonts.default,
      fontFamily: 'Raleway_400Regular',
    },
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: 'Raleway_400Regular',
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: 'Raleway_400Regular',
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: 'Raleway_400Regular',
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: 'Raleway_600SemiBold',
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: 'Raleway_600SemiBold',
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: 'Raleway_600SemiBold',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: 'Raleway_600SemiBold',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: 'Raleway_500Medium',
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: 'Raleway_500Medium',
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: 'Raleway_400Regular',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: 'Raleway_400Regular',
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: 'Raleway_400Regular',
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: 'Raleway_500Medium',
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: 'Raleway_500Medium',
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: 'Raleway_500Medium',
    },
  },
};

// Tema escuro customizado com cores especificadas e acessibilidade
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Usando as cores especificadas pelo usuário
    primary: customColors.lightBlue, // #A8C5E0
    secondary: customColors.mintTeal, // #9BC4BC
    tertiary: customColors.mintTeal,
    background: customColors.darkNavy, // #1A1F2E - cor padrão de fundo
    surface: customColors.darkSurface, // Superfície com contraste adequado
    surfaceVariant: customColors.darkBlueGray,
    error: customColors.coral,
    onPrimary: customColors.darkNavy, // Texto escuro sobre fundo claro (lightBlue)
    onSecondary: customColors.darkNavy, // Texto escuro sobre fundo claro (mintTeal)
    onTertiary: customColors.darkNavy,
    onBackground: customColors.darkText, // Texto claro com contraste adequado
    onSurface: customColors.darkText, // Texto claro com contraste adequado
    onSurfaceVariant: customColors.darkTextSecondary,
    onError: customColors.white,
    outline: customColors.darkBorder, // Bordas com contraste adequado
    outlineVariant: customColors.darkBorder,
    // Cores customizadas adicionais
    custom: customColors,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    default: {
      ...MD3DarkTheme.fonts.default,
      fontFamily: 'Raleway_400Regular',
    },
    displayLarge: {
      ...MD3DarkTheme.fonts.displayLarge,
      fontFamily: 'Raleway_400Regular',
    },
    displayMedium: {
      ...MD3DarkTheme.fonts.displayMedium,
      fontFamily: 'Raleway_400Regular',
    },
    displaySmall: {
      ...MD3DarkTheme.fonts.displaySmall,
      fontFamily: 'Raleway_400Regular',
    },
    headlineLarge: {
      ...MD3DarkTheme.fonts.headlineLarge,
      fontFamily: 'Raleway_600SemiBold',
    },
    headlineMedium: {
      ...MD3DarkTheme.fonts.headlineMedium,
      fontFamily: 'Raleway_600SemiBold',
    },
    headlineSmall: {
      ...MD3DarkTheme.fonts.headlineSmall,
      fontFamily: 'Raleway_600SemiBold',
    },
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontFamily: 'Raleway_600SemiBold',
    },
    titleMedium: {
      ...MD3DarkTheme.fonts.titleMedium,
      fontFamily: 'Raleway_500Medium',
    },
    titleSmall: {
      ...MD3DarkTheme.fonts.titleSmall,
      fontFamily: 'Raleway_500Medium',
    },
    bodyLarge: {
      ...MD3DarkTheme.fonts.bodyLarge,
      fontFamily: 'Raleway_400Regular',
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontFamily: 'Raleway_400Regular',
    },
    bodySmall: {
      ...MD3DarkTheme.fonts.bodySmall,
      fontFamily: 'Raleway_400Regular',
    },
    labelLarge: {
      ...MD3DarkTheme.fonts.labelLarge,
      fontFamily: 'Raleway_500Medium',
    },
    labelMedium: {
      ...MD3DarkTheme.fonts.labelMedium,
      fontFamily: 'Raleway_500Medium',
    },
    labelSmall: {
      ...MD3DarkTheme.fonts.labelSmall,
      fontFamily: 'Raleway_500Medium',
    },
  },
};
