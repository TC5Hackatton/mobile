import { renderHook } from '@testing-library/react-native';
import React from 'react';

jest.mock('./DependenciesContext', () => ({
  useDependencies: jest.fn(),
}));

jest.mock('@/src/domain', () => ({
  CreateTaskUseCase: jest.fn(),
  FetchAllTasksUseCase: jest.fn(),
  FetchOldestTodoStatusUseCase: jest.fn(),
}));

import { CreateTaskUseCase, FetchAllTasksUseCase, FetchOldestTodoStatusUseCase } from '@/src/domain';
import { useDependencies } from './DependenciesContext';
import { TaskProvider, useTask } from './TaskContext';

const mockUseDependencies = useDependencies as jest.MockedFunction<typeof useDependencies>;
const MockCreateTaskUseCase = CreateTaskUseCase as jest.Mock;
const MockFetchAllTasksUseCase = FetchAllTasksUseCase as jest.Mock;
const MockFetchOldestTodoStatusUseCase = FetchOldestTodoStatusUseCase as jest.Mock;

const buildWrapper = () => {
  const mockFetchAllTasks = { execute: jest.fn() };
  const mockFetchOldestTodoStatus = { execute: jest.fn() };
  const mockCreateTask = { execute: jest.fn() };

  MockFetchAllTasksUseCase.mockImplementation(() => mockFetchAllTasks);
  MockFetchOldestTodoStatusUseCase.mockImplementation(() => mockFetchOldestTodoStatus);
  MockCreateTaskUseCase.mockImplementation(() => mockCreateTask);

  mockUseDependencies.mockReturnValue({
    authRepository: {} as any,
    taskRepository: {} as any,
    logger: {} as any,
    storageRepository: {} as any,
    sessionRepository: {} as any,
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => <TaskProvider>{children}</TaskProvider>;

  return { wrapper, mockFetchAllTasks, mockCreateTask };
};

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TaskProvider', () => {
    it('should provide all useCases', () => {
      const { wrapper } = buildWrapper();

      const { result } = renderHook(() => useTask(), { wrapper });

      expect(result.current.fetchAllTasksUseCase).toBeDefined();
      expect(result.current.fetchOldestTodoStatusUseCase).toBeDefined();
      expect(result.current.createTaskUseCase).toBeDefined();
    });

    it('should provide stable use case references on re-render', () => {
      const { wrapper } = buildWrapper();

      const { result, rerender } = renderHook(() => useTask(), { wrapper });

      const firstResult = result.current;
      rerender({});

      expect(result.current.fetchAllTasksUseCase).toBe(firstResult.fetchAllTasksUseCase);
      expect(result.current.fetchOldestTodoStatusUseCase).toBe(firstResult.fetchOldestTodoStatusUseCase);
      expect(result.current.createTaskUseCase).toBe(firstResult.createTaskUseCase);
    });

    it('should instantiate FetchAllTasksUseCase with taskRepository', () => {
      const mockDeps = {
        authRepository: {} as any,
        taskRepository: { id: 'task-repo' } as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: { id: 'session-repo' } as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);

      const mockFetchAllTasks = { execute: jest.fn() };
      MockFetchAllTasksUseCase.mockImplementation(() => mockFetchAllTasks);
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => <TaskProvider>{children}</TaskProvider>;

      renderHook(() => useTask(), { wrapper });

      expect(MockFetchAllTasksUseCase).toHaveBeenCalledWith(mockDeps.taskRepository);
    });

    it('should instantiate FetchOldestTodoStatusUseCase with taskRepository', () => {
      const mockDeps = {
        authRepository: {} as any,
        taskRepository: { id: 'task-repo' } as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: { id: 'session-repo' } as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);

      const mockFetchOldestTodoStatus = { execute: jest.fn() };
      MockFetchOldestTodoStatusUseCase.mockImplementation(() => mockFetchOldestTodoStatus);
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => <TaskProvider>{children}</TaskProvider>;

      renderHook(() => useTask(), { wrapper });

      expect(MockFetchOldestTodoStatusUseCase).toHaveBeenCalledWith(mockDeps.taskRepository);
    });

    it('should instantiate CreateTaskUseCase with sessionRepository and taskRepository', () => {
      const mockDeps = {
        authRepository: {} as any,
        taskRepository: { id: 'task-repo' } as any,
        logger: {} as any,
        storageRepository: {} as any,
        sessionRepository: { id: 'session-repo' } as any,
      };

      mockUseDependencies.mockReturnValue(mockDeps);

      MockFetchAllTasksUseCase.mockImplementation(() => ({ execute: jest.fn() }));
      MockCreateTaskUseCase.mockImplementation(() => ({ execute: jest.fn() }));

      const wrapper = ({ children }: { children: React.ReactNode }) => <TaskProvider>{children}</TaskProvider>;

      renderHook(() => useTask(), { wrapper });

      expect(MockCreateTaskUseCase).toHaveBeenCalledWith(mockDeps.sessionRepository, mockDeps.taskRepository);
    });
  });

  describe('useTask error handling', () => {
    it('should throw when used outside TaskProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTask());
      }).toThrow('useTask must be used within TaskProvider');

      consoleError.mockRestore();
    });
  });
});
