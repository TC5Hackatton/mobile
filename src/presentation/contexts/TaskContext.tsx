import {
  CreateTaskUseCase,
  FetchAllTasksUseCase,
  FetchOldestTodoStatusUseCase,
  UpdateTaskStatusUseCase,
} from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface TaskUseCases {
  fetchAllTasksUseCase: FetchAllTasksUseCase;
  fetchOldestTodoStatusUseCase: FetchOldestTodoStatusUseCase;
  createTaskUseCase: CreateTaskUseCase;
  updateTaskStatusUseCase: UpdateTaskStatusUseCase;
}

// Create a context for Task dependencies
const TaskContext = createContext<TaskUseCases | null>(null);

// Component (Provider) that provides Task dependencies instantiated through context
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { sessionRepository, taskRepository } = useDependencies();

  const taskUseCases = useMemo<TaskUseCases>(
    () => ({
      fetchAllTasksUseCase: new FetchAllTasksUseCase(sessionRepository, taskRepository),
      fetchOldestTodoStatusUseCase: new FetchOldestTodoStatusUseCase(sessionRepository, taskRepository),
      createTaskUseCase: new CreateTaskUseCase(sessionRepository, taskRepository),
      updateTaskStatusUseCase: new UpdateTaskStatusUseCase(taskRepository),
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
