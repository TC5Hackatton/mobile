import { act, renderHook } from '@testing-library/react-native';
import { useFocusTimer } from './use-focus-timer';

describe('useFocusTimer', () => {
  jest.useFakeTimers();

  it('must calculate progress correctly', () => {
    const { result } = renderHook(() => useFocusTimer(10));

    act(() => {
      result.current.toggleTimer();
      jest.advanceTimersByTime(300000);
    });

    // (600 - 300) / 600 = 0.5
    expect(result.current.progress).toBe(0.5);
  });

  it('must format time as MM:SS', () => {
    const { result } = renderHook(() => useFocusTimer(1));
    expect(result.current.formatTime()).toBe('01:00');
  });
});
