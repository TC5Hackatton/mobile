import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn(),
}));

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { CustomButton } from './custom-button';

const mockUseThemeColors = useThemeColors as jest.MockedFunction<typeof useThemeColors>;

const mockColors = {
  lightGreen: '#A8DBA8',
  coral: '#E89B8C',
  primary: '#5B8DBE',
  white: '#FFFFFF',
} as any;

describe('CustomButton', () => {
  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with the provided label', () => {
    render(<CustomButton label="Entrar" onPress={jest.fn()} />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<CustomButton label="Entrar" onPress={onPressMock} />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should NOT call onPress when disabled', () => {
    const onPressMock = jest.fn();
    render(<CustomButton label="Disabled" onPress={onPressMock} disabled={true} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should NOT call onPress when loading', () => {
    const onPressMock = jest.fn();
    render(<CustomButton label="Loading" onPress={onPressMock} loading={true} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show ActivityIndicator and hide label when loading', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton label="Submit" onPress={jest.fn()} loading={true} />,
    );

    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.queryByText('Submit')).toBeNull();
  });

  it('should show label and hide ActivityIndicator when not loading', () => {
    const { UNSAFE_queryAllByType } = render(
      <CustomButton label="Submit" onPress={jest.fn()} loading={false} />,
    );

    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_queryAllByType(ActivityIndicator)).toHaveLength(0);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  describe('variants', () => {
    it('should use lightGreen background for primary variant (default)', () => {
      render(<CustomButton label="Primary" onPress={jest.fn()} variant="primary" />);

      expect(screen.getByRole('button').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.lightGreen }),
      );
    });

    it('should use coral background for cancel variant', () => {
      render(<CustomButton label="Cancel" onPress={jest.fn()} variant="cancel" />);

      expect(screen.getByRole('button').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.coral }),
      );
    });

    it('should use primary color background for secondary variant', () => {
      render(<CustomButton label="Secondary" onPress={jest.fn()} variant="secondary" />);

      expect(screen.getByRole('button').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.primary }),
      );
    });

    it('should default to lightGreen when no variant is provided', () => {
      render(<CustomButton label="Default" onPress={jest.fn()} />);

      expect(screen.getByRole('button').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.lightGreen }),
      );
    });
  });

  describe('accessibility', () => {
    it('should use custom accessibilityLabel when provided, falling back to label', () => {
      const { rerender } = render(
        <CustomButton label="Submit" onPress={jest.fn()} accessibilityLabel="My accessibility label" />,
      );
      expect(screen.getByRole('button', { name: 'My accessibility label' })).toBeTruthy();

      rerender(<CustomButton label="My Button" onPress={jest.fn()} />);
      expect(screen.getByRole('button', { name: 'My Button' })).toBeTruthy();
    });

    it('should report disabled and busy states in accessibility', () => {
      const { rerender } = render(
        <CustomButton label="Btn" onPress={jest.fn()} disabled={true} />,
      );
      expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });

      rerender(<CustomButton label="Btn" onPress={jest.fn()} loading={true} />);
      expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ busy: true });
    });

    it('should propagate testID', () => {
      render(<CustomButton label="Test" onPress={jest.fn()} testID="my-button" />);
      expect(screen.getByTestId('my-button')).toBeTruthy();
    });
  });
});
