import { Task, TaskStatus } from '@/src/domain';
import { TimeType } from '@/src/domain/enums/TimeType';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useFocusTimer } from '@/src/presentation/hooks/use-focus-timer';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

const SECONDS_PER_MINUTE = 60;

interface TimerState {
  elapsedSeconds: number;
  autoStart: boolean;
}

/**
 * Computes how much total time has been consumed by a task, and whether
 * the timer should start running immediately.
 *
 * - elapsedSeconds = previous sessions (timeSpend) + current running session
 * - autoStart      = true only when the task is currently DOING
 *
 * This keeps two concerns separate: where to position the timer display
 * vs. whether to start ticking automatically.
 */
const computeTimerState = (task: Task | null): TimerState => {
  if (!task) return { elapsedSeconds: 0, autoStart: false };

  const previousSessionSeconds = Math.round(task.timeSpend * SECONDS_PER_MINUTE);

  if (task.status === TaskStatus.DOING && task.statusChangedAt) {
    const currentSessionSeconds = Math.floor(
      (Date.now() - new Date(task.statusChangedAt).getTime()) / 1000,
    );
    return {
      elapsedSeconds: previousSessionSeconds + currentSessionSeconds,
      autoStart: true,
    };
  }

  // Task is paused (TODO) — show accumulated time but don't auto-start
  return { elapsedSeconds: previousSessionSeconds, autoStart: false };
};

export function useFocusSession() {
  const { fetchFocusTasksUseCase, updateTaskStatusUseCase } = useTask();

  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  // Stored separately so it only changes when a task is loaded from the DB,
  // not on every local status update (toggle), preventing spurious timer resets.
  const [timerState, setTimerState] = useState<TimerState>({ elapsedSeconds: 0, autoStart: false });

  const isCronometro = currentTask?.timeType === TimeType.CRONOMETRO;

  const { formatTime, isActive, toggleTimer, progress } = useFocusTimer(
    currentTask?.timeValue ?? 0,
    currentTask?.timeType ?? TimeType.TEMPO_FIXO,
    timerState.elapsedSeconds,
    timerState.autoStart,
  );

  useEffect(() => {
    async function loadTasks() {
      try {
        const { current, next } = await fetchFocusTasksUseCase.execute();
        setCurrentTask(current);
        setNextTask(next);
        setTimerState(computeTimerState(current));
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
      // timerState is intentionally NOT updated here — the timer is already
      // running from its current position via toggleTimer().
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  const handleNextTask = async () => {
    if (!currentTask) return;

    try {
      setLoading(true);

      // Pause the current task if it's running (saves accumulated time, moves to TODO)
      if (currentTask.status === TaskStatus.DOING) {
        await updateTaskStatusUseCase.execute(currentTask, TaskStatus.TODO);
      }

      // Start the next task if one exists (moves to DOING, sets statusChangedAt)
      if (nextTask) {
        await updateTaskStatusUseCase.execute(nextTask, TaskStatus.DOING);
      }

      // Refresh the queue — DOING tasks are promoted to current by the use case
      const { current, next } = await fetchFocusTasksUseCase.execute();
      setCurrentTask(current);
      setNextTask(next);
      setTimerState(computeTimerState(current));
      setShowConfirm(false);
    } catch (error) {
      console.error('Erro ao avançar para próxima tarefa:', error);
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
    handleNextTask,
    progress,
    showConfirm,
    setShowConfirm,
  };
}
