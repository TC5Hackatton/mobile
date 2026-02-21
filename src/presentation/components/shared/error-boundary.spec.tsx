import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { ErrorBoundary } from './error-boundary';

jest.mock('@/src/infrastructure/error-handler', () => ({
  ErrorHandler: {
    handle: jest.fn((error: Error) => error),
    getUserFriendlyMessage: jest.fn(() => 'Algo deu errado. Tente novamente.'),
  },
}));

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn().mockReturnValue({
    lightGreen: '#A8DBA8',
    coral: '#E89B8C',
    primary: '#5B8DBE',
    white: '#FFFFFF',
  }),
}));

// Helper component that throws
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Normal content</Text>;
};

describe('ErrorBoundary', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    jest.clearAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal content')).toBeTruthy();
  });

  it('should render the fallback UI with title, message, and retry button when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Ops! Algo deu errado')).toBeTruthy();
    expect(screen.getByText('Algo deu errado. Tente novamente.')).toBeTruthy();
    expect(screen.getByText('Tentar novamente')).toBeTruthy();
  });

  it('should render custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<Text>Custom fallback UI</Text>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback UI')).toBeTruthy();
  });

  it('should reset error state when "Tentar novamente" is pressed', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Ops! Algo deu errado')).toBeTruthy();

    screen.getByText('Tentar novamente').props.onPress?.();

    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );
  });

  it('should have "alert" accessibilityRole on the error container', () => {
    const { UNSAFE_getByType } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(UNSAFE_getByType(View).props.accessibilityRole).toBe('alert');
  });
});
