import { useMemo } from 'react';
import {
    getAdjustedFontSize,
    getAdjustedLineHeight,
    typography,
    type FontSize,
} from '../constants/typography';
import { useFontSizeContext } from '../contexts/FontSizeContext';


export function useFontSize() {
  const { fontSizeScale } = useFontSizeContext();

  const adjustedFontSizes = useMemo(() => {
    const sizes = {
      xs: getAdjustedFontSize(typography.fontSize.xs, fontSizeScale),
      sm: getAdjustedFontSize(typography.fontSize.sm, fontSizeScale),
      md: getAdjustedFontSize(typography.fontSize.md, fontSizeScale),
      lg: getAdjustedFontSize(typography.fontSize.lg, fontSizeScale),
      xl: getAdjustedFontSize(typography.fontSize.xl, fontSizeScale),
      xxl: getAdjustedFontSize(typography.fontSize.xxl, fontSizeScale),
      xxxl: getAdjustedFontSize(typography.fontSize.xxxl, fontSizeScale),
    };
    return sizes;
  }, [fontSizeScale]);

  const adjustedLineHeights = useMemo(() => {
    return {
      xs: getAdjustedLineHeight(typography.lineHeight.xs, fontSizeScale),
      sm: getAdjustedLineHeight(typography.lineHeight.sm, fontSizeScale),
      md: getAdjustedLineHeight(typography.lineHeight.md, fontSizeScale),
      lg: getAdjustedLineHeight(typography.lineHeight.lg, fontSizeScale),
      xl: getAdjustedLineHeight(typography.lineHeight.xl, fontSizeScale),
      xxl: getAdjustedLineHeight(typography.lineHeight.xxl, fontSizeScale),
      xxxl: getAdjustedLineHeight(typography.lineHeight.xxxl, fontSizeScale),
    };
  }, [fontSizeScale]);

  const getFontSize = (size: FontSize) => {
    return adjustedFontSizes[size];
  };

  const getLineHeight = (size: FontSize) => {
    return adjustedLineHeights[size];
  };

  return {
    fontSizeScale,
    fontSize: adjustedFontSizes,
    lineHeight: adjustedLineHeights,
    getFontSize,
    getLineHeight,
  };
}
