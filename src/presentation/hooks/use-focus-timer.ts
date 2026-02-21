import { useCallback, useEffect, useState } from 'react';

export function useFocusTimer(initialMinutes: number = 25) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = useCallback(() => setIsActive(!isActive), [isActive]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { seconds, isActive, toggleTimer, formatTime };
}
