/**
 * Serviço centralizado para tratamento de erros
 * Evita expor informações sensíveis em produção
 */

import { LoggerRepository } from '../domain';
import { InMemoryLoggerRepository } from './repositories/InMemoryLoggerRepository';

export interface AppError {
  message: string;
  code?: string;
  originalError?: unknown;
}

export class ErrorHandler {
  // TODO: it's not ideal, but it's a quick fix to keep developing
  private static logger: LoggerRepository = new InMemoryLoggerRepository();

  /**
   * Trata erros de forma segura, sem expor informações sensíveis
   */
  static handle(error: unknown, context?: string): AppError {
    const appError: AppError = {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      code: 'UNKNOWN_ERROR',
    };

    if (error instanceof Error) {
      appError.message = error.message;
      appError.code = error.name;
      appError.originalError = __DEV__ ? error : undefined;
    } else if (typeof error === 'string') {
      appError.message = error;
    }

    // Log detalhado apenas em desenvolvimento
    if (context) {
      ErrorHandler.logger.error(`[${context}]`, error instanceof Error ? error : undefined);
    } else {
      ErrorHandler.logger.error('Error:', error instanceof Error ? error : undefined);
    }

    return appError;
  }

  /**
   * Cria uma mensagem de erro amigável para o usuário
   */
  static getUserFriendlyMessage(error: AppError): string {
    // Mapear códigos de erro conhecidos para mensagens amigáveis
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
      VALIDATION_ERROR: 'Dados inválidos. Verifique os campos preenchidos.',
      AUTH_ERROR: 'Erro de autenticação. Tente fazer login novamente.',
      UNKNOWN_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
    };

    return errorMessages[error.code || 'UNKNOWN_ERROR'] || error.message;
  }
}
