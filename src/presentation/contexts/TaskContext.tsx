import {
  CreateTaskUseCase,
  FetchAllTasksUseCase,
  FetchFocusTasksUseCase,
  FetchStatisticsFromUserTasksUseCase,
  UpdateTaskStatusUseCase,
} from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface TaskUseCases {
  createTaskUseCase: CreateTaskUseCase;
  fetchAllTasksUseCase: FetchAllTasksUseCase;
  fetchStatisticsFromUserTasksUseCase: FetchStatisticsFromUserTasksUseCase;
  updateTaskStatusUseCase: UpdateTaskStatusUseCase;
  fetchFocusTasksUseCase: FetchFocusTasksUseCase;
}

// Create a context for Task dependencies
const TaskContext = createContext<TaskUseCases | null>(null);

// Component (Provider) that provides Task dependencies instantiated through context
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { sessionRepository, taskRepository } = useDependencies();

  const taskUseCases = useMemo<TaskUseCases>(() => {
    return {
      createTaskUseCase: new CreateTaskUseCase(sessionRepository, taskRepository),
      fetchAllTasksUseCase: new FetchAllTasksUseCase(sessionRepository, taskRepository),
      fetchStatisticsFromUserTasksUseCase: new FetchStatisticsFromUserTasksUseCase(sessionRepository, taskRepository),
      updateTaskStatusUseCase: new UpdateTaskStatusUseCase(taskRepository),
      fetchFocusTasksUseCase: new FetchFocusTasksUseCase(taskRepository, sessionRepository), //Instanciando o case do modo foco aqui
    };
  }, [sessionRepository, taskRepository]);

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
