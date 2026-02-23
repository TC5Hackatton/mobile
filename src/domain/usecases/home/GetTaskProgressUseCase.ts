import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { GetStoredSessionUseCase } from '@/src/domain/usecases/user/GetStoredSessionUseCase';
import { TaskStatus } from '../../enums/TaskStatus';

export class GetTaskProgressUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly getStoredSessionUseCase: GetStoredSessionUseCase,
  ) {}

  async execute() {
    const session = await this.getStoredSessionUseCase.execute();

    if (!session || !session.uid) {
      return { completed: 0, total: 0 };
    }

    const tasks = await this.taskRepository.fetchAll();

    //Filtrando as tasks pelo usuário logado
    const userTasks = tasks.filter((t) => t.uid === session.uid);

    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === TaskStatus.DONE).length;

    return {
      completed,
      total,
    };
  }
}
