import { SessionRepository } from "../../repositories/SessionRepository";
import { TaskRepository } from "../../repositories/TaskRepository";

export class FetchOldestTodoStatusUseCase {
  constructor(private readonly sessionRepository: SessionRepository, private readonly taskRepository: TaskRepository) { }

  async execute() {
    const session = await this.sessionRepository.getStoredSession();
    return this.taskRepository.fetchOldestTodoStatus(session?.uid || '');
  }
}
