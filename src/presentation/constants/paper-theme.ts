import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Cores customizadas
export const customColors = {
  lightGray: '#F7F8FA',
  mediumGray: '#707070',
  veryLightGray: '#FAFBFC',
  darkNavy: '#1A1F2E',
  lightBlue: '#A8C5E0',
  mintTeal: '#9BC4BC',
  darkBlueGray: '#2C3E50',
  mediumBlue: '#5B8DBE',
  gray: '#6B7280',
  skyBlue: '#6B9BD1',
  teal: '#81C3B4',
  tealGreen: '#7AB8A8',
  yellow: '#F5D06C',
  coral: '#E89B8C',
  lightGreen: '#A8DBA8',
  white: '#FFFFFF',
};

// Tema claro customizado
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: customColors.mediumBlue,
    secondary: customColors.mintTeal,
    tertiary: customColors.skyBlue,
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
    outlineVariant: customColors.lightBlue,
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

// Tema escuro customizado
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: customColors.skyBlue,
    secondary: customColors.teal,
    tertiary: customColors.mintTeal,
    background: customColors.darkNavy,
    surface: customColors.darkBlueGray,
    surfaceVariant: customColors.darkBlueGray,
    error: customColors.coral,
    onPrimary: customColors.white,
    onSecondary: customColors.white,
    onTertiary: customColors.white,
    onBackground: customColors.white,
    onSurface: customColors.white,
    onSurfaceVariant: customColors.lightBlue,
    onError: customColors.white,
    outline: customColors.gray,
    outlineVariant: customColors.mediumGray,
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
