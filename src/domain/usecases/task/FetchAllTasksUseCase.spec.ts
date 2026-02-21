import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { TaskRepository } from '../../repositories/TaskRepository';
import { FetchAllTasksUseCase } from './FetchAllTasksUseCase';

describe('FetchAllTasksUseCase', () => {
  let fetchAllTasksUseCase: FetchAllTasksUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      fetchAll: jest.fn(),
      createTask: jest.fn(),
    };

    fetchAllTasksUseCase = new FetchAllTasksUseCase(mockTaskRepository);
  });

  it('should return all tasks from repository', async () => {
    const mockTasks = [
      Task.create('Task 1', 'Description 1', TimeType.CRONOMETRO, 60, 30, TaskStatus.DOING, new Date(), 'task-1', 'user-1'),
      Task.create('Task 2', 'Description 2', TimeType.TEMPO_FIXO, 120, 120, TaskStatus.DONE, new Date(), 'task-2', 'user-1'),
      Task.create('Task 3', 'Description 3', TimeType.CRONOMETRO, 90, 0, TaskStatus.TODO, new Date(), 'task-3', 'user-1'),
    ];

    mockTaskRepository.fetchAll.mockResolvedValue(mockTasks);

    const result = await fetchAllTasksUseCase.execute();

    expect(mockTaskRepository.fetchAll).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockTasks);
    expect(result).toHaveLength(3);
  });

  it('should return empty array when no tasks exist', async () => {
    mockTaskRepository.fetchAll.mockResolvedValue([]);

    const result = await fetchAllTasksUseCase.execute();

    expect(mockTaskRepository.fetchAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should propagate errors from repository', async () => {
    const repositoryError = new Error('Failed to fetch tasks');
    mockTaskRepository.fetchAll.mockRejectedValue(repositoryError);

    await expect(fetchAllTasksUseCase.execute()).rejects.toThrow('Failed to fetch tasks');
    expect(mockTaskRepository.fetchAll).toHaveBeenCalledTimes(1);
  });
});
