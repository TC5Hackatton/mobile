import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { GetStoredSessionUseCase } from '@/src/domain/usecases/user/GetStoredSessionUseCase';
import { TaskStatus } from '../../enums/TaskStatus';
import { GetTaskProgressUseCase } from './GetTaskProgressUseCase';

describe('GetTaskProgressUseCase', () => {
  let useCase: GetTaskProgressUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockGetStoredSessionUseCase: jest.Mocked<GetStoredSessionUseCase>;

  beforeEach(() => {
    mockTaskRepository = {
      fetchAll: jest.fn(),
      fetchOldestTodoStatus: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    } as any;

    mockGetStoredSessionUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new GetTaskProgressUseCase(mockTaskRepository, mockGetStoredSessionUseCase);
  });

  describe('execute', () => {
    it('should return 0 completed/total when no session exists', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue(null);

      const result = await useCase.execute();

      expect(result).toEqual({ completed: 0, total: 0 });
      expect(mockTaskRepository.fetchAll).not.toHaveBeenCalled();
    });

    it('should calculate progress only for the logged-in user (uid)', async () => {
      const userId = 'user_123';
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: userId } as any);

      const mockTasks = [
        { uid: userId, status: TaskStatus.DONE },
        { uid: userId, status: TaskStatus.TODO },
        { uid: 'other_user', status: TaskStatus.DONE },
      ];
      mockTaskRepository.fetchAll.mockResolvedValue(mockTasks as any);

      const result = await useCase.execute();

      expect(result.total).toBe(2);
      expect(result.completed).toBe(1);
      expect(mockTaskRepository.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors if TaskRepository fails', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: 'any' } as any);
      mockTaskRepository.fetchAll.mockRejectedValue(new Error('DB Error'));

      await expect(useCase.execute()).rejects.toThrow('DB Error');
    });
  });
});
