import { LoggerRepository } from '@/src/domain';

const isDevelopment = __DEV__;

export class InMemoryLoggerRepository implements LoggerRepository {
  log(content: string | object): void {
    if (isDevelopment) {
      console.log(content);
    }
  }

  error(content: string | object, error?: Error): void {
    if (isDevelopment) {
      console.error(content, error);
    }
  }

  info(content: string): void {
    if (isDevelopment) {
      console.info(content);
    }
  }
}
