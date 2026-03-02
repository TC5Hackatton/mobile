import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn(),
}));

import { FontSizeProvider } from '@/src/presentation/contexts/FontSizeContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { LinkText } from './link-text';

const mockUseThemeColors = useThemeColors as jest.MockedFunction<typeof useThemeColors>;

const mockColors = {
  tertiary: '#6B9BD0',
} as any;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FontSizeProvider>{children}</FontSizeProvider>
);

describe('LinkText', () => {
  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with the provided text', () => {
    render(<LinkText text="Esqueci minha senha" onPress={jest.fn()} />, { wrapper });
    expect(screen.getByText('Esqueci minha senha')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPressMock = jest.fn();
    render(<LinkText text="Click me" onPress={onPressMock} />, { wrapper });

    fireEvent.press(screen.getByText('Click me'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should apply tertiary color from theme to the text', () => {
    render(<LinkText text="Link" onPress={jest.fn()} />, { wrapper });

    expect(screen.getByText('Link').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: mockColors.tertiary })]),
    );
  });
});
