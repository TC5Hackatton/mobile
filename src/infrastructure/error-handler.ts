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
  // NOTE: it's not ideal, but it's a quick fix to keep developing
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

      // Tratar erros do Firebase Auth
      // Firebase errors têm a propriedade 'code' no objeto de erro
      const firebaseError = error as Error & { code?: string };
      if (firebaseError.code) {
        appError.code = firebaseError.code;
        appError.message = ErrorHandler.getFirebaseErrorMessage(firebaseError.code);
      }
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
   * Mapeia códigos de erro do Firebase Auth para mensagens amigáveis
   */
  private static getFirebaseErrorMessage(code: string): string {
    const firebaseErrorMessages: Record<string, string> = {
      'auth/invalid-email': 'E-mail inválido. Verifique o formato do e-mail.',
      'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
      'auth/user-not-found': 'E-mail não encontrado. Verifique se o e-mail está correto.',
      'auth/wrong-password': 'Senha incorreta. Tente novamente.',
      'auth/email-already-in-use': 'Este e-mail já está em uso. Tente fazer login ou use outro e-mail.',
      'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
      'auth/invalid-credential': 'Credenciais inválidas. Verifique seu e-mail e senha.',
      'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
    };

    return firebaseErrorMessages[code] || 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
  }

  /**
   * Cria uma mensagem de erro amigável para o usuário
   */
  static getUserFriendlyMessage(error: AppError): string {
    // Se já foi tratado pelo getFirebaseErrorMessage, retorna a mensagem
    if (error.message && !error.message.includes('Ocorreu um erro inesperado')) {
      return error.message;
    }

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
