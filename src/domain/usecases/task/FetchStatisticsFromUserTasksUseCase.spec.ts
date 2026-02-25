import { Task } from '@/src/domain/entities/Task';
import { TaskStatus } from '@/src/domain/enums/TaskStatus';
import { TimeType } from '@/src/domain/enums/TimeType';
import { SessionRepository } from '@/src/domain/repositories/SessionRepository';
import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { FetchStatisticsFromUserTasksUseCase } from './FetchStatisticsFromUserTasksUseCase';

describe('FetchStatisticsFromUserTasksUseCase', () => {
  let useCase: FetchStatisticsFromUserTasksUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      fetchAll: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    } as any;

    mockSessionRepository = {
      getStoredSession: jest.fn(),
      storeSession: jest.fn(),
      clearSession: jest.fn(),
    } as any;

    useCase = new FetchStatisticsFromUserTasksUseCase(mockSessionRepository, mockTaskRepository);
  });

  describe('execute — no session', () => {
    it('should return default empty statistics when no session exists', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue(null);

      const result = await useCase.execute();

      expect(result).toEqual({
        oldestTask: null,
        progress: { completed: 0, total: 0 },
        totalFocusTime: '0 min',
      });
      expect(mockTaskRepository.fetchAll).not.toHaveBeenCalled();
    });
  });

  describe('execute — oldest task', () => {
    it('should return the oldest TODO task (last in DESC-ordered list)', async () => {
      const userId = 'user_123';
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: userId } as any);

      const newerTask = Task.create('Newer', 'Desc', TimeType.CRONOMETRO, 0, 0, TaskStatus.TODO, new Date('2024-02-01'));
      const olderTask = Task.create('Older', 'Desc', TimeType.CRONOMETRO, 0, 0, TaskStatus.TODO, new Date('2024-01-01'));

      // fetchAll returns tasks ordered by createdAt DESC — newer first, older last
      mockTaskRepository.fetchAll.mockResolvedValue([newerTask, olderTask]);

      const result = await useCase.execute();

      expect(result.oldestTask).toBe(olderTask);
    });

    it('should return null oldestTask when there are no TODO tasks', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([
        Task.create('Done', 'Desc', TimeType.CRONOMETRO, 0, 0, TaskStatus.DONE, new Date()),
      ]);

      const result = await useCase.execute();

      expect(result.oldestTask).toBeNull();
    });

    it('should return null oldestTask when task list is empty', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result.oldestTask).toBeNull();
    });
  });

  describe('execute — task progress', () => {
    it('should calculate completed and total tasks correctly', async () => {
      const userId = 'user_123';
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: userId } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([
        { status: TaskStatus.DONE, timeSpend: 0 },
        { status: TaskStatus.TODO, timeSpend: 0 },
        { status: TaskStatus.DONE, timeSpend: 0 },
      ] as any);

      const result = await useCase.execute();

      expect(result.progress.total).toBe(3);
      expect(result.progress.completed).toBe(2);
    });
  });

  describe('execute — total focus time', () => {
    it('should round up 0.73 to 1 min (Math.round rule)', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ status: TaskStatus.TODO, timeSpend: 0.73 }] as any);

      const result = await useCase.execute();

      expect(result.totalFocusTime).toBe('1 min');
    });

    it('should round down 0.49 to 0 min', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ status: TaskStatus.TODO, timeSpend: 0.49 }] as any);

      const result = await useCase.execute();

      expect(result.totalFocusTime).toBe('0 min');
    });

    it('should format hours and minutes correctly (e.g., 65.7 min → 66 min → 1h 6min)', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ status: TaskStatus.TODO, timeSpend: 65.7 }] as any);

      const result = await useCase.execute();

      expect(result.totalFocusTime).toBe('1h 6min');
    });

    it('should format whole hours without minutes (e.g., 120 min → 2h)', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ status: TaskStatus.TODO, timeSpend: 120 }] as any);

      const result = await useCase.execute();

      expect(result.totalFocusTime).toBe('2h');
    });

    it('should sum timeSpend across multiple tasks', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([
        { status: TaskStatus.TODO, timeSpend: 10.5 },
        { status: TaskStatus.DONE, timeSpend: 5.2 },
      ] as any);

      const result = await useCase.execute();

      // 10.5 + 5.2 = 15.7 → round → 16
      expect(result.totalFocusTime).toBe('16 min');
    });
  });

  describe('execute — error propagation', () => {
    it('should propagate errors if TaskRepository.fetchAll fails', async () => {
      mockSessionRepository.getStoredSession.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockRejectedValue(new Error('DB Error'));

      await expect(useCase.execute()).rejects.toThrow('DB Error');
    });
  });
});
