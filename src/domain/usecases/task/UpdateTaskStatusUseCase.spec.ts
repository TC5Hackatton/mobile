import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { TaskRepository } from '../../repositories/TaskRepository';
import { UpdateTaskStatusUseCase } from './UpdateTaskStatusUseCase';

describe('UpdateTaskStatusUseCase', () => {
  let updateTaskStatusUseCase: UpdateTaskStatusUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      fetchAll: jest.fn(),
      fetchOldestTodoStatus: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    };
    updateTaskStatusUseCase = new UpdateTaskStatusUseCase(mockTaskRepository);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set statusChangedAt when moving to DOING', async () => {
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 100, 0, TaskStatus.TODO, new Date(), 'id', 'uid');

    const now = new Date(2024, 0, 1, 12, 0, 0);
    jest.setSystemTime(now);

    await updateTaskStatusUseCase.execute(task, TaskStatus.DOING);

    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: TaskStatus.DOING,
        statusChangedAt: now,
      })
    );
  });

  it('should calculate and add elapsed time when moving from DOING to DONE', async () => {
    const startTime = new Date(2024, 0, 1, 12, 0, 0);
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 100, 10, TaskStatus.DOING, new Date(), 'id', 'uid', startTime);

    const finishTime = new Date(2024, 0, 1, 12, 1, 0); // 1 minute later
    jest.setSystemTime(finishTime);

    await updateTaskStatusUseCase.execute(task, TaskStatus.DONE);

    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: TaskStatus.DONE,
        timeSpend: 10 + 1, // Original 10 + 1 minute elapsed
        statusChangedAt: undefined,
      })
    );
  });

  it('should calculate and add elapsed time when moving from DOING to TODO (Pause)', async () => {
    const startTime = new Date(2024, 0, 1, 12, 0, 0);
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 100, 10, TaskStatus.DOING, new Date(), 'id', 'uid', startTime);

    const pauseTime = new Date(2024, 0, 1, 12, 0, 30); // 30 seconds later (0.5 minutes)
    jest.setSystemTime(pauseTime);

    await updateTaskStatusUseCase.execute(task, TaskStatus.TODO);

    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: TaskStatus.TODO,
        timeSpend: 10 + 0.5, // Original 10 + 0.5 minutes elapsed
        statusChangedAt: undefined,
      })
    );
  });

  it('should not change timeSpend if statusChangedAt is missing in DOING state', async () => {
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 100, 10, TaskStatus.DOING, new Date(), 'id', 'uid', undefined);

    await updateTaskStatusUseCase.execute(task, TaskStatus.DONE);

    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: TaskStatus.DONE,
        timeSpend: 10, // Unchanged
      })
    );
  });

  it('should round timeSpend to 2 decimal places when leaving DOING state', async () => {
    const startTime = new Date(2024, 0, 1, 12, 0, 0);
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 100, 10, TaskStatus.DOING, new Date(), 'id', 'uid', startTime);

    // 13 seconds = 0.21666666666666667 minutes -> should be 10.22 after rounding
    const finishTime = new Date(2024, 0, 1, 12, 0, 13);
    jest.setSystemTime(finishTime);

    await updateTaskStatusUseCase.execute(task, TaskStatus.DONE);

    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        timeSpend: 10.22,
      })
    );
  });
});
