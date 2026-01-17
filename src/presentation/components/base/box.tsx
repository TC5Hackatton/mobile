import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { spacing, type Spacing } from '@/src/presentation/constants/spacing';

export interface BoxProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: Spacing | number;
  paddingX?: Spacing | number;
  paddingY?: Spacing | number;
  paddingTop?: Spacing | number;
  paddingBottom?: Spacing | number;
  paddingLeft?: Spacing | number;
  paddingRight?: Spacing | number;
  margin?: Spacing | number;
  marginX?: Spacing | number;
  marginY?: Spacing | number;
  marginTop?: Spacing | number;
  marginBottom?: Spacing | number;
  marginLeft?: Spacing | number;
  marginRight?: Spacing | number;
  backgroundColor?: string;
  borderRadius?: number;
  flex?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

const getSpacing = (value: Spacing | number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return spacing[value];
};

export function Box({
  children,
  style,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor,
  borderRadius,
  flex,
  alignItems,
  justifyContent,
  testID,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
}: BoxProps) {
  const boxStyle: ViewStyle = {
    padding: getSpacing(padding),
    paddingHorizontal: getSpacing(paddingX),
    paddingVertical: getSpacing(paddingY),
    paddingTop: getSpacing(paddingTop),
    paddingBottom: getSpacing(paddingBottom),
    paddingLeft: getSpacing(paddingLeft),
    paddingRight: getSpacing(paddingRight),
    margin: getSpacing(margin),
    marginHorizontal: getSpacing(marginX),
    marginVertical: getSpacing(marginY),
    marginTop: getSpacing(marginTop),
    marginBottom: getSpacing(marginBottom),
    marginLeft: getSpacing(marginLeft),
    marginRight: getSpacing(marginRight),
    backgroundColor,
    borderRadius,
    flex,
    alignItems,
    justifyContent,
  };

  return (
    <View
      style={[boxStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole as any}
      accessibilityHint={accessibilityHint}>
      {children}
    </View>
  );
}
