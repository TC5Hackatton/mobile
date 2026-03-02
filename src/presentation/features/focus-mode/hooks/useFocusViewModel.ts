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

  // Hook do Timer
  const { formatTime, isActive, toggleTimer, progress } = useFocusTimer(currentTask?.timeValue || 25);

  //Carga inicial de dados via Use Case unificado
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
          text2: 'Tente novamente mais tarde.' + (error instanceof Error ? ` Detalhes: ${error.message}` : ''),
        });
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [fetchFocusTasksUseCase]);

  //Lógica de Play/Pause atualizando status no banco
  const handleToggleTimer = async () => {
    if (!currentTask) return;

    try {
      const newStatus = isActive ? TaskStatus.TODO : TaskStatus.DOING;

      await updateTaskStatusUseCase.execute(currentTask, newStatus);

      toggleTimer();

      const { current } = await fetchFocusTasksUseCase.execute();
      setCurrentTask(current);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  //Função para finalizar a tarefa atual e ir para a próxima, chamada ao confirmar no dialog
  const handleFinishTask = async () => {
    if (!currentTask) return;

    try {
      setLoading(true);
      // 1. Atualiza para DONE (Isso também calculará o timeSpend final se estiver em DOING)
      await updateTaskStatusUseCase.execute(currentTask, TaskStatus.DONE);

      // 2. Busca a próxima tarefa da fila
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
