import { CreateTaskUseCase } from '@/src/domain';
import { createContext, useContext, useMemo } from 'react';
import { useDependencies } from './DependenciesContext';

export interface TaskUseCases {
  createTaskUseCase: CreateTaskUseCase;
}

// Create a context for Task dependencies
const TaskContext = createContext<TaskUseCases | null>(null);

// Component (Provider) that provides Task dependencies instantiated through context
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { authRepository, taskRepository } = useDependencies();

  const taskUseCases = useMemo<TaskUseCases>(
    () => ({
      createTaskUseCase: new CreateTaskUseCase(authRepository, taskRepository),
    }),
    [authRepository, taskRepository],
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
