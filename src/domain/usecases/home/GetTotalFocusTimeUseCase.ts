export class GetTotalFocusTimeUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<string> {
    const tasks = await this.taskRepository.getAll();
    
    // Soma o estimatedTime (ou timeValue) apenas das tarefas concluídas
    const totalMinutes = tasks
      .filter(t => t.status === TaskStatus.DONE)
      .reduce((acc, task) => acc + (task.timeValue || 0), 0);

    if (totalMinutes < 60) return `${totalMinutes} min`;
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins}m`;
  }
}