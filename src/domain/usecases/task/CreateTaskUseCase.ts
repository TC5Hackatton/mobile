import { CreateTaskDTO } from '@/src/data';
import { SessionRepository } from '../../repositories/SessionRepository';
import { TaskRepository } from '../../repositories/TaskRepository';

export class CreateTaskUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(task: CreateTaskDTO) {
    // Get stored session instead of fetching from Firebase
    const session = await this.sessionRepository.getStoredSession();

    if (!session?.uid) {
      throw new Error('User is not authenticated');
    }

    return this.taskRepository.createTask(task, session.uid);
  }
}
