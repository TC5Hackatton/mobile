import React from 'react';
import { ViewStyle } from 'react-native';

import { Box, type BoxProps } from './box';
import { spacing } from '@/src/presentation/constants/spacing';

export interface ContainerProps extends BoxProps {
  maxWidth?: number;
  centerContent?: boolean;
}

export function Container({
  children,
  maxWidth = 400,
  centerContent = false,
  style,
  ...boxProps
}: ContainerProps) {
  const containerStyle: ViewStyle = {
    maxWidth,
    width: '100%',
    alignSelf: centerContent ? 'center' : 'stretch',
  };

  return (
    <Box style={[containerStyle, style]} {...boxProps}>
      {children}
    </Box>
  );
}
