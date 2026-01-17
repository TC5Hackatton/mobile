import { useCallback } from 'react';
import { router } from 'expo-router';

import { logger } from '@/src/infrastructure/logger';

export function useAppHeader() {
  const handleExpandPress = useCallback(() => {
    logger.log('Expand pressed');
    // TODO: Implementar ação de expandir
  }, []);

  const handleThemeTogglePress = useCallback(() => {
    logger.log('Theme toggle pressed');
    // TODO: Implementar toggle de tema
  }, []);

  return {
    handleExpandPress,
    handleThemeTogglePress,
  };
}
