// Repositories
export * from './repositories/AsyncStorageRepository';
export * from './repositories/FirebaseAuthRepository';
export * from './repositories/FirebaseTaskRepository';
export * from './repositories/InMemoryLoggerRepository';
export * from './repositories/InMemorySessionRepository';

/**
 * Exporta todos os módulos de infraestrutura
 * TODO: validar se esse módulo será necessário ao final do desenvolvimento e onde ele
 * ... deveria ficar, já que é "interno"
 */
export * from './error-handler';
