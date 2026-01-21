import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Box, type BoxProps } from './box';

export interface StackProps extends Omit<BoxProps, 'flexDirection'> {
  direction?: 'row' | 'column';
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
}

export function Stack({
  children,
  direction = 'column',
  gap,
  align,
  justify,
  style,
  ...boxProps
}: StackProps) {
  const stackStyle: ViewStyle = {
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <Box style={[stackStyle, style]} {...boxProps}>
      {children}
    </Box>
  );
}
