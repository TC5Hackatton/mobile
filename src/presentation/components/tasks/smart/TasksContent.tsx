import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Task, TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

import { FloatingActionButton } from '../../shared/floating-action-button';
import useTaskLabels from '../hooks/useTaskLabels';
import TasksListCard from '../presentational/TasksListCard';
import { TaskLabel } from '../types/TaskLabel';

export type TaskWithLabel = Task & { labels: TaskLabel[] };
type TaskState = Record<TaskStatus, TaskWithLabel[]>;

export default function TasksContent() {
  const colors = useThemeColors();
  const { calculateLabels } = useTaskLabels();
  const { fetchAllTasksUseCase, updateTaskStatusUseCase } = useTask();

  const [tasks, setTasks] = useState<TaskState>({
    [TaskStatus.TODO]: [],
    [TaskStatus.DOING]: [],
    [TaskStatus.DONE]: [],
  });

  const fetchTasks = useCallback(async () => {
    const localTasks = await fetchAllTasksUseCase.execute();

    const groupedTasks = localTasks.reduce(
      (acc: TaskState, task: Task) => {
        acc[task.status].push({
          ...task,
          labels: calculateLabels(task),
          statusLabel: task.statusLabel,
          createdAtLabel: task.createdAtLabel,
          shortDescription: task.shortDescription,
        });
        return acc;
      },
      { [TaskStatus.TODO]: [], [TaskStatus.DOING]: [], [TaskStatus.DONE]: [] },
    );

    setTasks(groupedTasks);
  }, [fetchAllTasksUseCase, calculateLabels]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleUpdateStatus = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTaskStatusUseCase.execute(task, newStatus);
      await fetchTasks();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar tarefa',
        text2: 'Ocorreu um erro ao tentar atualizar o status da tarefa.',
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={[]}>
        <AppHeader title="Tarefas" />

        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToStart
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContent}>
            <TasksListCard
              tasks={tasks[TaskStatus.TODO]}
              status={TaskStatus.TODO}
              onPressStart={(task: Task) => handleUpdateStatus(task, TaskStatus.DOING)}
            />
            <TasksListCard
              tasks={tasks[TaskStatus.DOING]}
              status={TaskStatus.DOING}
              onPressFinish={(task: Task) => handleUpdateStatus(task, TaskStatus.DONE)}
              onPressPause={(task: Task) => handleUpdateStatus(task, TaskStatus.TODO)}
            />
            <TasksListCard tasks={tasks[TaskStatus.DONE]} status={TaskStatus.DONE} />
          </ScrollView>
        </View>
      </SafeAreaView>

      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});
