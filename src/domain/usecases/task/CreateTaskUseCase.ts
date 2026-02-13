import { CreateTaskDTO } from '@/src/data';
import { AuthRepository } from '../../repositories/AuthRepository';
import { TaskRepository } from '../../repositories/TaskRepository';

export class CreateTaskUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(task: CreateTaskDTO) {
    // TODO: eu deveria ter uma store com o user armazenado quando ele estiver logado, e pegar de lá? (Boa pergunta para grupo de estudos)
    const user = await this.authRepository.getCurrentUser();

    if (!user?.uid) {
      throw new Error('User is missing');
    }

    return this.taskRepository.createTask(task, user.uid);
  }
}
