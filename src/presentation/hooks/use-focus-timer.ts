import { TimeType } from '@/src/domain/enums/TimeType';
import { useCallback, useEffect, useState } from 'react';

const SECONDS_PER_MINUTE = 60;
const ONE_SECOND_MS = 1000;

const getInitialSeconds = (isCronometro: boolean, initialMinutes: number, elapsedSeconds: number): number => {
  // cronômetro: display total time spent — keeps going up from elapsed
  if (isCronometro) return elapsedSeconds;
  // tempo_fixo: display remaining time — counts down from (total - elapsed)
  return Math.max(0, initialMinutes * SECONDS_PER_MINUTE - elapsedSeconds);
};

export function useFocusTimer(
  initialMinutes: number,
  timeType: TimeType,
  elapsedSeconds: number = 0,
  autoStart: boolean = false,
) {
  const isCronometro = timeType === TimeType.CRONOMETRO;
  const totalSeconds = initialMinutes * SECONDS_PER_MINUTE;

  const [seconds, setSeconds] = useState(() => getInitialSeconds(isCronometro, initialMinutes, elapsedSeconds));
  const [isActive, setIsActive] = useState(autoStart);

  // Re-sync when the task changes (new task loaded, or elapsed/autoStart updated from DB)
  useEffect(() => {
    setSeconds(getInitialSeconds(isCronometro, initialMinutes, elapsedSeconds));
    setIsActive(autoStart);
  }, [initialMinutes, isCronometro, elapsedSeconds, autoStart]);

  useEffect(() => {
    if (!isActive) return;

    if (!isCronometro && seconds === 0) {
      setIsActive(false);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((s) => (isCronometro ? s + 1 : s - 1));
    }, ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, [isActive, seconds, isCronometro]);

  const toggleTimer = useCallback(() => setIsActive((a) => !a), []);

  const formatTime = useCallback(() => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = seconds % SECONDS_PER_MINUTE;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  // cronômetro: cycles 0→1 every minute (no finite goal)
  // tempo_fixo: 0→1 over the full timeValue duration
  const progress = isCronometro
    ? (seconds % SECONDS_PER_MINUTE) / SECONDS_PER_MINUTE
    : totalSeconds > 0
      ? (totalSeconds - seconds) / totalSeconds
      : 0;

  return {
    isActive,
    toggleTimer,
    formatTime,
    progress,
  };
}
