import { SessionRepository } from '@/src/domain/repositories/SessionRepository';
import { TaskRepository } from '../../repositories/TaskRepository';

export class FetchAllTasksUseCase {
  constructor(private sessionRepository: SessionRepository, private taskRepository: TaskRepository) { }

  async execute() {
    const session = await this.sessionRepository.getStoredSession();
    return this.taskRepository.fetchAll(session?.uid || '');
  }
}
