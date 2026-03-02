import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { SessionRepository } from '../../repositories/SessionRepository';

export class FetchFocusTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(): Promise<{ current: Task | null; next: Task | null }> {
    const session = await this.sessionRepository.getStoredSession();

    if (!session) return { current: null, next: null };

    const tasks = await this.taskRepository.fetchAll(session.uid);

    const pendingTasks = tasks
      .filter((t) => t.status !== TaskStatus.DONE)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });

    return {
      current: pendingTasks[0] || null,
      next: pendingTasks[1] || null,
    };
  }
}
