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

  describe('resuming an in-progress task', () => {
    it('tempo_fixo + DOING: starts at remaining time and is immediately active', () => {
      // 10-minute task, 5 minutes (300s) already elapsed across all sessions
      const { result } = renderHook(() => useFocusTimer(10, TimeType.TEMPO_FIXO, 300, true));

      expect(result.current.formatTime()).toBe('05:00'); // 600 - 300 = 300s remaining
      expect(result.current.isActive).toBe(true);
    });

    it('tempo_fixo + DOING: progress starts at 0.5 when half the time has elapsed', () => {
      const { result } = renderHook(() => useFocusTimer(10, TimeType.TEMPO_FIXO, 300, true));

      expect(result.current.progress).toBeCloseTo(0.5);
    });

    it('tempo_fixo + TODO (paused): shows remaining time but is NOT active', () => {
      // 10-minute task, 5 minutes already spent in previous sessions, currently paused
      const { result } = renderHook(() => useFocusTimer(10, TimeType.TEMPO_FIXO, 300, false));

      expect(result.current.formatTime()).toBe('05:00');
      expect(result.current.isActive).toBe(false);
    });

    it('cronometro + DOING: starts at total elapsed seconds and is immediately active', () => {
      // 90 seconds of total time spent (previous + current session)
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO, 90, true));

      expect(result.current.formatTime()).toBe('01:30');
      expect(result.current.isActive).toBe(true);
    });

    it('cronometro + TODO (paused): shows time already spent but is NOT active', () => {
      const { result } = renderHook(() => useFocusTimer(0, TimeType.CRONOMETRO, 90, false));

      expect(result.current.formatTime()).toBe('01:30');
      expect(result.current.isActive).toBe(false);
    });

    it('resets to zero and stops when a fresh TODO task loads (elapsedSeconds = 0, autoStart = false)', async () => {
      let elapsed = 300;
      let auto = true;
      const { result, rerender } = renderHook(() =>
        useFocusTimer(10, TimeType.TEMPO_FIXO, elapsed, auto),
      );

      expect(result.current.isActive).toBe(true);

      elapsed = 0;
      auto = false;
      act(() => rerender(() => useFocusTimer(10, TimeType.TEMPO_FIXO, elapsed, auto)));

      await waitFor(() => expect(result.current.isActive).toBe(false));
      expect(result.current.formatTime()).toBe('10:00');
    });
  });
});

