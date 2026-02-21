import { CreateTaskDTO } from '@/src/data';
import { Session } from '../../entities/Session';
import { Task } from '../../entities/Task';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { SessionRepository } from '../../repositories/SessionRepository';
import { TaskRepository } from '../../repositories/TaskRepository';
import { CreateTaskUseCase } from './CreateTaskUseCase';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockSessionRepository: jest.Mocked<SessionRepository>;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  const mockTaskDTO: CreateTaskDTO = {
    title: 'Test Task',
    description: 'Test Description',
    timeType: TimeType.CRONOMETRO,
    timeSpend: 0,
    status: TaskStatus.TODO,
    createdAt: new Date()
  };

  beforeEach(() => {
    mockSessionRepository = {
      saveSession: jest.fn(),
      getStoredSession: jest.fn(),
      clearSession: jest.fn(),
    };

    mockTaskRepository = {
      fetchAll: jest.fn(),
      createTask: jest.fn(),
      fetchOldestTodoStatus: jest.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(mockSessionRepository, mockTaskRepository);
  });

  it('should create a task successfully when session exists with uid', async () => {
    const mockSession = Session.create('user-123', 'mock-token');

    const mockTask = Task.create(
      'Test Task',
      'Test Description',
      TimeType.CRONOMETRO,
      60,
      0,
      TaskStatus.TODO,
      new Date(),
      'task-456',
      'user-123'
    );

    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession);
    mockTaskRepository.createTask.mockResolvedValue(undefined);

    await createTaskUseCase.execute(mockTaskDTO);

    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(mockTaskDTO, 'user-123');
  });

  it('should throw error when session is null', async () => {
    mockSessionRepository.getStoredSession.mockResolvedValue(null);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is not authenticated');
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should throw error when session is undefined', async () => {
    mockSessionRepository.getStoredSession.mockResolvedValue(undefined as any);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is not authenticated');
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should throw error when session has no uid', async () => {
    const mockSessionWithoutUid = Session.create('', 'mock-token');

    mockSessionRepository.getStoredSession.mockResolvedValue(mockSessionWithoutUid);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is not authenticated');
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });



  it('should propagate errors from authRepository', async () => {
    const authError = new Error('Auth service unavailable');
    mockSessionRepository.getStoredSession.mockRejectedValue(authError);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('Auth service unavailable');
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should propagate errors from taskRepository', async () => {
    const mockSession = Session.create('user-123', 'mock-token');

    const taskError = new Error('Database connection failed');
    mockSessionRepository.getStoredSession.mockResolvedValue(mockSession);
    mockTaskRepository.createTask.mockRejectedValue(taskError);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('Database connection failed');
    expect(mockSessionRepository.getStoredSession).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(mockTaskDTO, 'user-123');
  });
});
