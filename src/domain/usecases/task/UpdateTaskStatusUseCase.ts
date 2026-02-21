import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TaskRepository } from '../../repositories/TaskRepository';

export class UpdateTaskStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) { }

  async execute(task: Task, newStatus: TaskStatus): Promise<void> {
    let timeSpend = task.timeSpend;
    let statusChangedAt: Date | undefined = undefined;

    if (task.status === TaskStatus.DOING) {
      if (task.statusChangedAt) {
        const now = new Date();
        const elapsedMs = now.getTime() - task.statusChangedAt.getTime();
        const elapsedMinutes = elapsedMs / (1000 * 60);
        timeSpend = Number((timeSpend + elapsedMinutes).toFixed(2));
      }
    }

    if (newStatus === TaskStatus.DOING) {
      statusChangedAt = new Date();
    }

    const updatedTask = Task.create(
      task.title,
      task.description,
      task.timeType,
      task.timeValue,
      timeSpend,
      newStatus,
      task.createdAt,
      task.id,
      task.uid,
      statusChangedAt,
    );

    await this.taskRepository.updateTask(updatedTask);
  }
}
