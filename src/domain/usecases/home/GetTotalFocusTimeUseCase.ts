import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { GetStoredSessionUseCase } from '@/src/domain/usecases/user/GetStoredSessionUseCase';

export class GetTotalFocusTimeUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly getStoredSessionUseCase: GetStoredSessionUseCase,
  ) { }

  async execute(): Promise<string> {
    const session = await this.getStoredSessionUseCase.execute();

    if (!session || !session.uid) {
      return '0 min';
    }

    const tasks = await this.taskRepository.fetchAll(session.uid);

    // Soma o tempo de foco
    const totalMinutes = tasks.reduce((acc, task) => acc + (task.timeSpend || 0), 0);

    // REGRA DE ARREDONDAMENTO: 0.73 vira 1 | 0.49 vira 0 * Podemos alterar isso se a maioria achar que não faz sentido.
    const roundedMinutes = Math.round(totalMinutes);

    if (roundedMinutes < 60) {
      return `${roundedMinutes} min`;
    }

    const hours = Math.floor(roundedMinutes / 60);
    const minutes = roundedMinutes % 60;

    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
}
