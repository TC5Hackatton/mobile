export interface LoggerRepository {
  log(content: string | object): void;
  error(content: string | object, error?: Error): void;
  info(content: string | object): void;
}
