import { render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn(),
}));

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { Text } from 'react-native';
import { ContentCard } from './content-card';

const mockUseThemeColors = useThemeColors as jest.MockedFunction<typeof useThemeColors>;

const mockColors = {
  surface: '#FFFFFF',
} as any;

describe('ContentCard', () => {
  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <ContentCard>
        <Text>Child content</Text>
      </ContentCard>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should apply surface background color from theme', () => {
    const { UNSAFE_getByType } = render(<ContentCard />);
    const { View } = require('react-native');
    const container = UNSAFE_getByType(View);

    expect(container.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: mockColors.surface })]),
    );
  });

  it('should propagate testID and accessibilityLabel', () => {
    render(<ContentCard testID="content-card" accessibilityLabel="My card" />);

    expect(screen.getByTestId('content-card')).toBeTruthy();
    expect(screen.getByLabelText('My card')).toBeTruthy();
  });

  it('should default accessibilityRole to "none" and accept a custom role', () => {
    const { UNSAFE_getByType, rerender } = render(<ContentCard />);
    const { View } = require('react-native');

    expect(UNSAFE_getByType(View).props.accessibilityRole).toBe('none');

    rerender(<ContentCard accessibilityRole="summary" />);

    expect(UNSAFE_getByType(View).props.accessibilityRole).toBe('summary');
  });

  it('should merge custom style with default styles', () => {
    const customStyle = { maxHeight: 200 };
    const { UNSAFE_getByType } = render(<ContentCard style={customStyle} />);
    const { View } = require('react-native');
    const view = UNSAFE_getByType(View);

    expect(view.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)]),
    );
  });
});
