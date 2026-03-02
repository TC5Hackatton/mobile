import { Task, TaskStatus } from '@/src/domain';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useFocusTimer } from '@/src/presentation/hooks/use-focus-timer';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useFocusViewModel() {
  const { fetchFocusTasksUseCase, updateTaskStatusUseCase } = useTask();

  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const { formatTime, isActive, toggleTimer, progress } = useFocusTimer(currentTask?.timeValue || 25);

  useEffect(() => {
    async function loadTasks() {
      try {
        const { current, next } = await fetchFocusTasksUseCase.execute();
        setCurrentTask(current);
        setNextTask(next);
      } catch (error) {
        console.error('Erro ao carregar modo foco:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [fetchFocusTasksUseCase]);

  const handleToggleTimer = async () => {
    if (!currentTask) return;

    try {
      const newStatus = isActive ? TaskStatus.TODO : TaskStatus.DOING;

      await updateTaskStatusUseCase.execute(currentTask, newStatus);

      toggleTimer();

      const { current } = await fetchFocusTasksUseCase.execute();
      setCurrentTask(current);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no modo foco',
        text2: 'Não foi possível iniciar ou pausar a tarefa. ' + (error as any)?.message || 'Erro desconhecido.',
      });
    }
  };

  const handleFinishTask = async () => {
    if (!currentTask) return;

    try {
      setLoading(true);
      await updateTaskStatusUseCase.execute(currentTask, TaskStatus.DONE);

      const { current, next } = await fetchFocusTasksUseCase.execute();
      setCurrentTask(current);
      setNextTask(next);

      setShowConfirm(false);
    } catch (error) {
      console.error('Erro ao finalizar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentTask,
    nextTask,
    loading,
    formatTime,
    isActive,
    handleToggleTimer,
    progress,
    showConfirm,
    setShowConfirm,
    handleFinishTask,
  };
}
