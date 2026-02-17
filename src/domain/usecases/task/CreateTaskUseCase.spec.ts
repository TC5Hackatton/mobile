import { CreateTaskDTO } from '@/src/data';
import { Task } from '../../entities/Task';
import { User } from '../../entities/User';
import { TaskStatus } from '../../enums/TaskStatus';
import { TimeType } from '../../enums/TimeType';
import { AuthRepository } from '../../repositories/AuthRepository';
import { TaskRepository } from '../../repositories/TaskRepository';
import { CreateTaskUseCase } from './CreateTaskUseCase';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  const mockTaskDTO: CreateTaskDTO = {
    title: 'Test Task',
    description: 'Test Description',
    timeType: TimeType.CRONOMETRO,
    timeSpent: 0,
    status: TaskStatus.TODO,
  };

  beforeEach(() => {
    mockAuthRepository = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      forgotPassword: jest.fn(),
      getCurrentUser: jest.fn(),
    };

    mockTaskRepository = {
      getAll: jest.fn(),
      createTask: jest.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(mockAuthRepository, mockTaskRepository);
  });

  it('should create a task successfully when user exists with uid', async () => {
    const mockUser = User.create(
      'test@example.com',
      'password',
      'Test User',
      undefined,
      'user-123'
    );

    const mockTask = Task.create(
      'Test Task',
      'Test Description',
      TimeType.CRONOMETRO,
      60,
      0,
      TaskStatus.TODO,
      'task-456',
      'user-123'
    );

    mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
    mockTaskRepository.createTask.mockResolvedValue(mockTask);

    const result = await createTaskUseCase.execute(mockTaskDTO);

    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(mockTaskDTO, 'user-123');
    expect(result).toBe(mockTask);
  });

  it('should throw error when user is null', async () => {
    mockAuthRepository.getCurrentUser.mockResolvedValue(null as any);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is missing');
    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should throw error when user is undefined', async () => {
    mockAuthRepository.getCurrentUser.mockResolvedValue(undefined as any);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is missing');
    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should throw error when user has no uid', async () => {
    const mockUserWithoutUid = User.create(
      'test@example.com',
      'password',
      'Test User'
    );

    mockAuthRepository.getCurrentUser.mockResolvedValue(mockUserWithoutUid);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is missing');
    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should throw error when user uid is empty string', async () => {
    const mockUserWithEmptyUid = User.create(
      'test@example.com',
      'password',
      'Test User',
      undefined,
      ''
    );

    mockAuthRepository.getCurrentUser.mockResolvedValue(mockUserWithEmptyUid);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('User is missing');
    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should propagate errors from authRepository', async () => {
    const authError = new Error('Auth service unavailable');
    mockAuthRepository.getCurrentUser.mockRejectedValue(authError);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('Auth service unavailable');
    expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
  });

  it('should propagate errors from taskRepository', async () => {
    const mockUser = User.create(
      'test@example.com',
      'password',
      'Test User',
      undefined,
      'user-123'
    );

    const taskError = new Error('Database connection failed');
    mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
    mockTaskRepository.createTask.mockRejectedValue(taskError);

    await expect(createTaskUseCase.execute(mockTaskDTO)).rejects.toThrow('Database connection failed');
    expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(mockTaskDTO, 'user-123');
  });
});
