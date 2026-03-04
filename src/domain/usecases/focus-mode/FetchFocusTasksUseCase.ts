import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { SessionRepository } from '../../repositories/SessionRepository';

export class FetchFocusTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private sessionRepository: SessionRepository,
  ) { }

  async execute(): Promise<{ current: Task | null; next: Task | null }> {
    const session = await this.sessionRepository.getStoredSession();

    if (!session) return { current: null, next: null };

    const tasks = await this.taskRepository.fetchAll(session.uid);

    const byOldestFirst = (a: Task, b: Task) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    // Separate by status, each sub-list sorted oldest-first independently.
    // This guarantees the oldest DOING task is always promoted to current,
    // even when multiple DOING tasks exist simultaneously.
    const doing = tasks.filter((t) => t.status === TaskStatus.DOING).sort(byOldestFirst);
    const todo = tasks.filter((t) => t.status === TaskStatus.TODO).sort(byOldestFirst);

    const ordered = [...doing, ...todo];

    return {
      current: ordered[0] ?? null,
      next: ordered[1] ?? null,
    };
  }
}

