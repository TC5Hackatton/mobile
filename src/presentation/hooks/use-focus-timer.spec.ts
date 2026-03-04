import { TimeType } from '@/src/domain/enums/TimeType';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useFocusTimer } from './use-focus-timer';

const tickSeconds = (n: number) => {
  for (let i = 0; i < n; i++) {
    act(() => { jest.advanceTimersByTime(1000); });
  }
};

describe('useFocusTimer', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  describe('tempo_fixo mode (countdown)', () => {
    it('starts with full time and formats it correctly', () => {
      const { result } = renderHook(() => useFocusTimer(1, TimeType.TEMPO_FIXO));
      expect(result.current.formatTime()).toBe('01:00');
    });

    it('progress goes from 0 to 0.5 after half the time elapses', async () => {
      const { result } = renderHook(() => useFocusTimer(10, TimeType.TEMPO_FIXO));

      act(() => { result.current.toggleTimer(); });
      tickSeconds(300); // 5 min out of 10 min

      await waitFor(() => expect(result.current.progress).toBeCloseTo(0.5));
    });

    it('stops automatically when countdown reaches zero', async () => {
      const { result } = renderHook(() => useFocusTimer(1, TimeType.TEMPO_FIXO));

      act(() => { result.current.toggleTimer(); });
      tickSeconds(60);

      await waitFor(() => expect(result.current.isActive).toBe(false));
    });
  });

  describe('cronometro mode (count-up)', () => {
    it('starts at 00:00', () => {
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO));
      expect(result.current.formatTime()).toBe('00:00');
    });

    it('counts up over time', async () => {
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO));

      act(() => { result.current.toggleTimer(); });
      tickSeconds(90); // 1 min 30 s

      await waitFor(() => expect(result.current.formatTime()).toBe('01:30'));
    });

    it('progress cycles back to 0 at the start of each new minute', async () => {
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO));

      act(() => { result.current.toggleTimer(); });
      tickSeconds(60); // exactly 1 full minute — cycle resets

      await waitFor(() => expect(result.current.progress).toBeCloseTo(0));
    });

    it('progress reaches ~0.5 at 30 seconds into a minute', async () => {
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO));

      act(() => { result.current.toggleTimer(); });
      tickSeconds(30);

      await waitFor(() => expect(result.current.progress).toBeCloseTo(0.5));
    });
  });
});

