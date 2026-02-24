import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { Session } from '../../entities/Session';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { SessionRepository } from '../../repositories/SessionRepository';
import { GetFocusTasksUseCase } from './GetFocusTasksUseCase';

describe('GetFocusTasksUseCase', () => {
  let sut: GetFocusTasksUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let sessionRepository: jest.Mocked<SessionRepository>;

  const mockSession: Session = { uid: 'user-123', email: 'test@test.com' } as Session;

  const createTask = (id: string, status: TaskStatus, createdAt: number, uid = 'user-123') => {
    return Task.create(`Task ${id}`, 'Description', 'tempo_fixo', 25, 0, status, new Date(createdAt), id, uid);
  };

  beforeEach(() => {
    taskRepository = {
      fetchAll: jest.fn(),
      updateTask: jest.fn(),
    } as any;

    sessionRepository = {
      getStoredSession: jest.fn(),
    } as any;

    sut = new GetFocusTasksUseCase(taskRepository, sessionRepository);
  });

  it('should return null if there is no active session.', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(null);

    const result = await sut.execute();

    expect(result).toEqual({ current: null, next: null });
  });

  it('should filter only TODO or DOING tasks for the logged-in user', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);

    const tasks = [
      createTask('1', TaskStatus.TODO, 1000),
      createTask('2', TaskStatus.DONE, 2000),
      createTask('3', TaskStatus.DOING, 3000),
      createTask('4', TaskStatus.TODO, 4000, 'outro-user'),
    ];

    taskRepository.fetchAll.mockResolvedValue(tasks);

    const result = await sut.execute();

    expect(result.current?.id).toBe('1');
    expect(result.next?.id).toBe('3');
  });

  it('should sort tasks by creation date (oldest first)', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);

    const tasks = [
      createTask('recente', TaskStatus.TODO, 9000),
      createTask('antiga', TaskStatus.TODO, 1000),
      createTask('meio', TaskStatus.TODO, 5000),
    ];

    taskRepository.fetchAll.mockResolvedValue(tasks);

    const result = await sut.execute();

    expect(result.current?.id).toBe('antiga');
    expect(result.next?.id).toBe('meio');
  });

  it('should return only current if there is only one pending task', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);
    taskRepository.fetchAll.mockResolvedValue([createTask('unica', TaskStatus.TODO, 1000)]);

    const result = await sut.execute();

    expect(result.current?.id).toBe('unica');
    expect(result.next).toBeNull();
  });
});
