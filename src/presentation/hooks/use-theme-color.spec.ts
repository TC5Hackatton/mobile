import { renderHook } from '@testing-library/react-native';
import { Colors } from '../constants/theme';

// Mock the useColorScheme hook
jest.mock('../hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

import { useColorScheme } from '../hooks/use-color-scheme';
import { useThemeColor } from './use-theme-color';

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useThemeColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color from Colors when theme is light and no prop override', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });

  it('should return dark color from Colors when theme is dark and no prop override', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.dark.text);
  });

  it('should return prop light color when theme is light and light prop is provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({ light: '#custom-light' }, 'text'));

    expect(result.current).toBe('#custom-light');
  });

  it('should return prop dark color when theme is dark and dark prop is provided', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({ dark: '#custom-dark' }, 'text'));

    expect(result.current).toBe('#custom-dark');
  });

  it('should fall back to Colors when prop for the current theme is not provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    // Only provides dark prop, not light
    const { result } = renderHook(() => useThemeColor({ dark: '#custom-dark' }, 'background'));

    expect(result.current).toBe(Colors.light.background);
  });

  it('should use "light" as fallback when useColorScheme returns null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });

  it('should return correct tint color for light theme', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'tint'));

    expect(result.current).toBe(Colors.light.tint);
  });

  it('should return correct tint color for dark theme', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'tint'));

    expect(result.current).toBe(Colors.dark.tint);
  });
});
