export class GetTaskProgressUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute() {
    const tasks = await this.taskRepository.getAll();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === TaskStatus.DONE).length;

    return {
      completed,
      total,
      stringFormat: `${completed}/${total}`,
    };
  }
}
