import { act, renderHook } from '@testing-library/react-native';

// Mock the react-native useColorScheme via module factory
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.useColorScheme = jest.fn().mockReturnValue('light');
  return RN;
});

import { useColorScheme } from './use-color-scheme.web';

describe('useColorScheme (web)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should return "light" before hydration regardless of system scheme', () => {
    // Before useEffect fires (no timers run), should return 'light'
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('should return actual color scheme after hydration when system is dark', async () => {
    const { useColorScheme: rnUseColorScheme } = require('react-native');
    rnUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useColorScheme());

    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current).toBe('dark');
  });

  it('should return "light" after hydration when system is light', async () => {
    const { useColorScheme: rnUseColorScheme } = require('react-native');
    rnUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useColorScheme());

    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current).toBe('light');
  });
});
