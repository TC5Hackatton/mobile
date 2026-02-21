/**
 * Constantes de ajuste de tamanho de fonte
 * P: Pequeno - reduz em 2
 * M: Médio - tamanho padrão (sem alteração)
 * G: Grande - aumenta em 2
 */
export const FONT_SIZE_ADJUSTMENTS = {
  P: -2,
  M: 0,
  G: 2,
} as const;

export type FontSizeScale = keyof typeof FONT_SIZE_ADJUSTMENTS;

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

/**
 * Aplica o ajuste de tamanho de fonte baseado na escala selecionada
 */
export function getAdjustedFontSize(
  baseSize: number,
  scale: FontSizeScale = 'M'
): number {
  return baseSize + FONT_SIZE_ADJUSTMENTS[scale];
}

/**
 * Aplica o ajuste de line height baseado na escala selecionada
 */
export function getAdjustedLineHeight(
  baseLineHeight: number,
  scale: FontSizeScale = 'M'
): number {
  return baseLineHeight + FONT_SIZE_ADJUSTMENTS[scale];
}
