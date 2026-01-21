/**
 * Configurações centralizadas do aplicativo
 * Usa variáveis de ambiente quando disponíveis
 */
import Constants from 'expo-constants';

const getEnvVar = (key: string, defaultValue: string): string => {
  return Constants.expoConfig?.extra?.[key] || defaultValue;
};

export const config = {
  api: {
    baseUrl: getEnvVar('API_BASE_URL', 'https://api.example.com'),
    timeout: parseInt(getEnvVar('API_TIMEOUT', '30000'), 10),
  },
  app: {
    name: 'MindEase',
    version: Constants.expoConfig?.version || '1.0.0',
    environment: __DEV__ ? 'development' : 'production',
  },
  features: {
    enableAnalytics: getEnvVar('ENABLE_ANALYTICS', 'false') === 'true',
    enableErrorReporting: getEnvVar('ENABLE_ERROR_REPORTING', 'true') === 'true',
  },
} as const;
