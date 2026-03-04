import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { Session } from '../../entities/Session';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { SessionRepository } from '../../repositories/SessionRepository';
import { FetchFocusTasksUseCase } from './FetchFocusTasksUseCase';

describe('FetchFocusTasksUseCase', () => {
  let sut: FetchFocusTasksUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let sessionRepository: jest.Mocked<SessionRepository>;

  const mockSession = { uid: 'user-123', email: 'test@test.com' } as unknown as Session;

  const createTask = (id: string, status: TaskStatus, createdAt: number, uid = 'user-123') => {
    return Task.create(`Task ${id}`, 'Description', TimeType.TEMPO_FIXO, 25, 0, status, new Date(createdAt), id, uid);
  };

  beforeEach(() => {
    taskRepository = {
      fetchAll: jest.fn(),
      updateTask: jest.fn(),
    } as any;

    sessionRepository = {
      getStoredSession: jest.fn(),
    } as any;

    sut = new FetchFocusTasksUseCase(taskRepository, sessionRepository);
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

    // DOING task '3' must be current even though '1' is older
    expect(result.current?.id).toBe('3');
    expect(result.next?.id).toBe('1');
  });

  it('should sort tasks by creation date (oldest first) when all are TODO', async () => {
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

  it('should prioritize a DOING task over older TODO tasks', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);

    const tasks = [
      createTask('oldest-todo', TaskStatus.TODO, 1000),
      createTask('middle-todo', TaskStatus.TODO, 2000),
      createTask('doing-newer', TaskStatus.DOING, 3000),
    ];

    taskRepository.fetchAll.mockResolvedValue(tasks);

    const result = await sut.execute();

    expect(result.current?.id).toBe('doing-newer');
    expect(result.next?.id).toBe('oldest-todo');
  });

  it('should pick the oldest DOING task as current when multiple DOING tasks exist', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);

    const tasks = [
      createTask('doing-newest', TaskStatus.DOING, 5000),
      createTask('doing-oldest', TaskStatus.DOING, 1000),
      createTask('doing-middle', TaskStatus.DOING, 3000),
      createTask('todo', TaskStatus.TODO, 500),
    ];

    taskRepository.fetchAll.mockResolvedValue(tasks);

    const result = await sut.execute();

    // Oldest DOING is always current; next is the second oldest DOING
    expect(result.current?.id).toBe('doing-oldest');
    expect(result.next?.id).toBe('doing-middle');
  });

  it('should return only current if there is only one pending task', async () => {
    sessionRepository.getStoredSession.mockResolvedValue(mockSession);
    taskRepository.fetchAll.mockResolvedValue([createTask('unica', TaskStatus.TODO, 1000)]);

    const result = await sut.execute();

    expect(result.current?.id).toBe('unica');
    expect(result.next).toBeNull();
  });
});

