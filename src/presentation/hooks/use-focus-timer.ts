import { useCallback, useEffect, useState } from 'react';

export function useFocusTimer(initialMinutes: number = 25) {
  const totalSeconds = initialMinutes * 60;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);

  // Sincroniza o timer caso a task mude (ex: carregou do banco)
  useEffect(() => {
    setSeconds(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = useCallback(() => setIsActive(!isActive), [isActive]);

  const resetTimer = useCallback(() => {
    setSeconds(totalSeconds);
    setIsActive(false);
  }, [totalSeconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cálculo da porcentagem para a barra de progresso
  const progress = totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds : 0;

  return {
    seconds,
    isActive,
    toggleTimer,
    resetTimer,
    formatTime,
    progress,
  };
}
