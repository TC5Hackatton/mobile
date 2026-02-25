import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { GetStoredSessionUseCase } from '@/src/domain/usecases/user/GetStoredSessionUseCase';
import { TaskStatus } from '../../enums/TaskStatus';

export class GetTaskProgressUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly getStoredSessionUseCase: GetStoredSessionUseCase,
  ) { }

  async execute() {
    const session = await this.getStoredSessionUseCase.execute();

    if (!session || !session.uid) {
      return { completed: 0, total: 0 };
    }

    const tasks = await this.taskRepository.fetchAll(session.uid);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === TaskStatus.DONE).length;

    return {
      completed,
      total,
    };
  }
}
