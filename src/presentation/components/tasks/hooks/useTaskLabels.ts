import { Task, TaskStatus } from "@/src/domain";
import { useThemeColors } from "@/src/presentation/hooks/use-theme-colors";
import { TaskLabel } from "../types/TaskLabel";

export default function useTaskLabels() {
  const colors = useThemeColors();

  function calculateLabels(task: Task): TaskLabel[] {
    const labels: TaskLabel[] = [];

    if (task.timeValue > 0) {
      labels.push({
        icon: 'clock-outline',
        text: `${task.timeValue} min`,
        color: colors.mediumGray,
      });
    }

    if (task.timeSpend > 0) {
      const isDone = task.status === TaskStatus.DONE;
      const isPaused = task.status === TaskStatus.TODO;

      labels.push({
        icon: isPaused ? 'timer-sand-paused' : 'timer-sand',
        text: `${task.timeSpend} min`,
        color: isDone ? colors.secondary : colors.primary,
      });
    }

    return labels;
  }

  return { calculateLabels };
}
