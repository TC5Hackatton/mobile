import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Task, TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

import { FloatingActionButton } from '../../shared/floating-action-button';
import TasksListCard from '../presentational/TasksListCard';

type TaskState = Record<TaskStatus, Task[]>;

export default function TasksContent() {
  const { fetchAllTasksUseCase } = useTask();
  const colors = useThemeColors();

  const [tasks, setTasks] = useState<TaskState>({
    [TaskStatus.TODO]: [],
    [TaskStatus.DOING]: [],
    [TaskStatus.DONE]: [],
  });

  useEffect(() => {
    async function fetchTasks() {
      const localTasks = await fetchAllTasksUseCase.execute();

      const groupedTasks = localTasks.reduce(
        (acc: TaskState, task: Task) => {
          acc[task.status].push(task);
          return acc;
        },
        { [TaskStatus.TODO]: [], [TaskStatus.DOING]: [], [TaskStatus.DONE]: [] },
      );

      setTasks(groupedTasks);
    }

    fetchTasks();
  }, [fetchAllTasksUseCase]);

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
            <TasksListCard tasks={tasks[TaskStatus.TODO]} status={TaskStatus.TODO} />
            <TasksListCard tasks={tasks[TaskStatus.DOING]} status={TaskStatus.DOING} />
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
