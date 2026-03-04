import { TimeType } from '@/src/domain/enums/TimeType';
import { useCallback, useEffect, useState } from 'react';

const SECONDS_PER_MINUTE = 60;
const ONE_SECOND_MS = 1000;

export function useFocusTimer(initialMinutes: number, timeType: TimeType) {
  const isCronometro = timeType === TimeType.CRONOMETRO;

  const [seconds, setSeconds] = useState(isCronometro ? 0 : initialMinutes * SECONDS_PER_MINUTE);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSeconds(isCronometro ? 0 : initialMinutes * SECONDS_PER_MINUTE);
    setIsActive(false);
  }, [initialMinutes, isCronometro]);

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

  const progress = isCronometro
    ? (seconds % SECONDS_PER_MINUTE) / SECONDS_PER_MINUTE
    : initialMinutes > 0
      ? (initialMinutes * SECONDS_PER_MINUTE - seconds) / (initialMinutes * SECONDS_PER_MINUTE)
      : 0;

  return {
    isActive,
    toggleTimer,
    formatTime,
    progress,
  };
}
