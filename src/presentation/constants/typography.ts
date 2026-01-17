/**
 * Sistema de tipografia consistente para o aplicativo
 */
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  fontFamily: {
    regular: 'Raleway_400Regular',
    medium: 'Raleway_500Medium',
    semiBold: 'Raleway_600SemiBold',
    bold: 'Raleway_700Bold',
  },
} as const;

export type FontSize = keyof typeof typography.fontSize;
export type FontFamily = keyof typeof typography.fontFamily;
