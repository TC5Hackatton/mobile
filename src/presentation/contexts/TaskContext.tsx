import {
  CreateTaskUseCase,
  FetchAllTasksUseCase,
  FetchOldestTodoStatusUseCase,
  GetStoredSessionUseCase,
  UpdateTaskStatusUseCase,
} from '@/src/domain';
import { FetchFocusTaskUseCase } from '@/src/domain/usecases/focus-mode/FetchFocusTasksUseCase';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface TaskUseCases {
  fetchAllTasksUseCase: FetchAllTasksUseCase;
  fetchOldestTodoStatusUseCase: FetchOldestTodoStatusUseCase;
  createTaskUseCase: CreateTaskUseCase;
  updateTaskStatusUseCase: UpdateTaskStatusUseCase;
  fetchFocusTasksUseCase: FetchFocusTaskUseCase;
}

// Create a context for Task dependencies
const TaskContext = createContext<TaskUseCases | null>(null);

// Component (Provider) that provides Task dependencies instantiated through context
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { sessionRepository, taskRepository } = useDependencies();

  const taskUseCases = useMemo<TaskUseCases>(
    () => ({
      getStoredSessionUseCase: new GetStoredSessionUseCase(sessionRepository),
      fetchAllTasksUseCase: new FetchAllTasksUseCase(taskRepository),
      fetchOldestTodoStatusUseCase: new FetchOldestTodoStatusUseCase(taskRepository),
      createTaskUseCase: new CreateTaskUseCase(sessionRepository, taskRepository),
      updateTaskStatusUseCase: new UpdateTaskStatusUseCase(taskRepository),
      fetchFocusTasksUseCase: new FetchFocusTaskUseCase(taskRepository, sessionRepository),
    }),
    [sessionRepository, taskRepository],
  );

  return <TaskContext.Provider value={taskUseCases}>{children}</TaskContext.Provider>;
}

// Custom hook to use task dependencies
export const useTask = () => {
  const taskUseCases = useContext(TaskContext);

  if (!taskUseCases) {
    throw new Error('useTask must be used within TaskProvider');
  }

  return taskUseCases;
};
