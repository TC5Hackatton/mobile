import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { SessionRepository } from '../../repositories/SessionRepository';

export class GetFocusTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(): Promise<{ current: Task | null; next: Task | null }> {
    const session = await this.sessionRepository.getStoredSession();

    // Debug: Verifique se o ID da sessão bate com o do print
    console.log('ID da Sessão Atual:', session?.uid);

    if (!session) return { current: null, next: null };

    const allTasks = await this.taskRepository.fetchAll();

    const pendingTasks = allTasks
      .filter((t) => {
        // Garantindo que estamos comparando strings e valores corretos do enum
        const isTodo =
          String(t.status).toLowerCase() === String(TaskStatus.TODO).toLowerCase() ||
          String(t.status).toLowerCase() === String(TaskStatus.DOING).toLowerCase();
        const isUserTask = String(t.uid) === String(session.uid);
        return isTodo && isUserTask;
      })
      .sort((a, b) => {
        // Garanta que createdAt seja tratado como timestamp numérico para ordenação
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : Number(a.createdAt) || 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : Number(b.createdAt) || 0;
        return dateA - dateB;
      });

    return {
      current: pendingTasks[0] || null,
      next: pendingTasks[1] || null,
    };
  }
}
