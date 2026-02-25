import { Task } from '@/src/domain/entities/Task';
import { TaskStatus } from '@/src/domain/enums/TaskStatus';
import { SessionRepository } from '@/src/domain/repositories/SessionRepository';
import { TaskRepository } from '@/src/domain/repositories/TaskRepository';

export interface UserTaskStatistics {
  oldestTask: Task | null;
  progress: { completed: number; total: number };
  totalFocusTime: string;
  taskCounts: { todo: number; doing: number; done: number; total: number };
}

export class FetchStatisticsFromUserTasksUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly taskRepository: TaskRepository,
  ) { }

  async execute(): Promise<UserTaskStatistics> {
    const session = await this.sessionRepository.getStoredSession();

    if (!session || !session.uid) {
      return {
        oldestTask: null,
        progress: { completed: 0, total: 0 },
        totalFocusTime: '0 min',
        taskCounts: { todo: 0, doing: 0, done: 0, total: 0 },
      };
    }

    const tasks = await this.taskRepository.fetchAll(session.uid);

    // Oldest TODO task — fetchAll is ordered by createdAt DESC, so the last TODO is the oldest
    const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO);
    const oldestTask = todoTasks.at(-1) ?? null;

    // Progress & task counts
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === TaskStatus.DONE).length;
    const doing = tasks.filter((t) => t.status === TaskStatus.DOING).length;
    const todo = todoTasks.length;

    // Focus time — ROUNDING RULE: 0.73 → 1 | 0.49 → 0
    const totalMinutes = tasks.reduce((acc, task) => acc + (task.timeSpend || 0), 0);
    const roundedMinutes = Math.round(totalMinutes);

    let totalFocusTime: string;
    if (roundedMinutes < 60) {
      totalFocusTime = `${roundedMinutes} min`;
    } else {
      const hours = Math.floor(roundedMinutes / 60);
      const minutes = roundedMinutes % 60;
      totalFocusTime = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }

    return {
      oldestTask,
      progress: { completed: done, total },
      totalFocusTime,
      taskCounts: { todo, doing, done, total },
    };
  }
}
