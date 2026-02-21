import { TaskRepository } from '../../repositories/TaskRepository';

export class FetchAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) { }

  execute() {
    return this.taskRepository.fetchAll();
  }
}
