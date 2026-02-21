import { TaskRepository } from "../../repositories/TaskRepository";

export class FetchOldestTodoStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) { }

  async execute() {
    return this.taskRepository.fetchOldestTodoStatus();
  }
}
