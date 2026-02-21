import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn(),
}));

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { LoadingIndicator } from './loading-indicator';

const mockUseThemeColors = useThemeColors as jest.MockedFunction<typeof useThemeColors>;

const mockColors = {
  background: '#F7F8FA',
  primary: '#5B8DBE',
} as any;

describe('LoadingIndicator', () => {
  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render an ActivityIndicator with theme colors', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator />);
    const { ActivityIndicator } = require('react-native');

    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
    expect(indicator.props.color).toBe(mockColors.primary);
  });

  it('should apply background color from theme to the container', () => {
    const { UNSAFE_getByType } = render(<LoadingIndicator />);
    const { View } = require('react-native');
    const container = UNSAFE_getByType(View);

    expect(container.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: mockColors.background })]),
    );
  });
});
