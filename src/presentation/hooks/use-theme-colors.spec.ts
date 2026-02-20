import { renderHook } from '@testing-library/react-native';
import { customColors } from '../constants/paper-theme';

// Mock the ThemeContext
jest.mock('../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from './use-theme-colors';

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('useThemeColors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('dark theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        isDark: true,
        themeMode: 'dark',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
    });

    it('should return dark background color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.background).toBe(customColors.darkNavy);
    });

    it('should return dark surface color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.surface).toBe(customColors.darkSurface);
    });

    it('should return dark text color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.text).toBe(customColors.darkText);
    });

    it('should return lightBlue as primary color in dark mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.primary).toBe(customColors.lightBlue);
    });

    it('should return mintTeal as secondary color in dark mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.secondary).toBe(customColors.mintTeal);
    });

    it('should return darkBorder as border color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.border).toBe(customColors.darkBorder);
    });

    it('should return coral as error color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.error).toBe(customColors.coral);
    });

    it('should return white as white color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.white).toBe(customColors.white);
    });

    it('should return darkNavy as tabBarBackground', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.tabBarBackground).toBe(customColors.darkNavy);
    });

    it('should return lightBlue as tabBarActive color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.tabBarActive).toBe(customColors.lightBlue);
    });

    it('should return skyBlue mapped to lightBlue in dark mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.skyBlue).toBe(customColors.lightBlue);
    });
  });

  describe('light theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        isDark: false,
        themeMode: 'light',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
    });

    it('should return lightGray as background color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.background).toBe(customColors.lightGray);
    });

    it('should return white as surface color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.surface).toBe(customColors.white);
    });

    it('should return darkNavy as text color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.text).toBe(customColors.darkNavy);
    });

    it('should return mediumBlue as primary color in light mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.primary).toBe(customColors.mediumBlue);
    });

    it('should return mintTealLight as secondary color in light mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.secondary).toBe(customColors.mintTealLight);
    });

    it('should return skyBlueLight as border color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.border).toBe(customColors.skyBlueLight);
    });

    it('should return coral as error color', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.error).toBe(customColors.coral);
    });

    it('should return white as tabBarBackground', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.tabBarBackground).toBe(customColors.white);
    });

    it('should return coral as tabBarActive color in light mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.tabBarActive).toBe(customColors.coral);
    });

    it('should return skyBlueLight as skyBlue in light mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.skyBlue).toBe(customColors.skyBlueLight);
    });

    it('should return tealGreen in light mode', () => {
      const { result } = renderHook(() => useThemeColors());
      expect(result.current.tealGreen).toBe(customColors.tealGreen);
    });
  });

  it('should memoize the result and not change reference when isDark is unchanged', () => {
    mockUseTheme.mockReturnValue({
      isDark: false,
      themeMode: 'light',
      toggleTheme: jest.fn(),
      setTheme: jest.fn(),
    });

    const { result, rerender } = renderHook(() => useThemeColors());
    const firstResult = result.current;

    rerender({});

    expect(result.current).toBe(firstResult);
  });
});
