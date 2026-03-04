import { Task, TaskStatus } from '@/src/domain';
import { TimeType } from '@/src/domain/enums/TimeType';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useFocusTimer } from '@/src/presentation/hooks/use-focus-timer';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useFocusSession() {
  const { fetchFocusTasksUseCase, updateTaskStatusUseCase } = useTask();

  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const isCronometro = currentTask?.timeType === TimeType.CRONOMETRO;

  const { formatTime, isActive, toggleTimer, progress } = useFocusTimer(
    currentTask?.timeValue ?? 0,
    currentTask?.timeType ?? TimeType.TEMPO_FIXO,
  );

  useEffect(() => {
    async function loadTasks() {
      try {
        const { current, next } = await fetchFocusTasksUseCase.execute();
        setCurrentTask(current);
        setNextTask(next);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar tarefas',
          text2:
            'Tente novamente mais tarde.' +
            (error instanceof Error ? ` Detalhes: ${error.message}` : ''),
        });
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

      setCurrentTask(
        Task.create(
          currentTask.title,
          currentTask.description,
          currentTask.timeType,
          currentTask.timeValue,
          currentTask.timeSpend,
          newStatus,
          currentTask.createdAt,
          currentTask.id,
          currentTask.uid,
          newStatus === TaskStatus.DOING ? new Date() : undefined,
        ),
      );
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
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
    isCronometro,
    formatTime,
    isActive,
    handleToggleTimer,
    progress,
    showConfirm,
    setShowConfirm,
    handleFinishTask,
  };
}
