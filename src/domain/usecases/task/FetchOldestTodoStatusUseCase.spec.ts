import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { TaskRepository } from '../../repositories/TaskRepository';
import { FetchOldestTodoStatusUseCase } from './FetchOldestTodoStatusUseCase';

describe('FetchOldestTodoStatusUseCase', () => {
  let fetchOldestTodoStatusUseCase: FetchOldestTodoStatusUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      fetchAll: jest.fn(),
      fetchOldestTodoStatus: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    } as any;
    fetchOldestTodoStatusUseCase = new FetchOldestTodoStatusUseCase(mockTaskRepository);
  });

  it('should call fetchOldestTodoStatus from repository', async () => {
    const mockTask = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 0, 0, TaskStatus.TODO, new Date());
    mockTaskRepository.fetchOldestTodoStatus.mockResolvedValue(mockTask);

    const result = await fetchOldestTodoStatusUseCase.execute();

    expect(mockTaskRepository.fetchOldestTodoStatus).toHaveBeenCalled();
    expect(result).toBe(mockTask);
  });

  it('should return null if repository returns null', async () => {
    mockTaskRepository.fetchOldestTodoStatus.mockResolvedValue(null);

    const result = await fetchOldestTodoStatusUseCase.execute();

    expect(result).toBeNull();
  });
});
