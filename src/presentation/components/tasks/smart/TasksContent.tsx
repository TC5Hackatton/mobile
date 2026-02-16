import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Task, TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useTask } from '@/src/presentation/contexts/TaskContext';

import TasksListCard from '../presentational/TasksListCard';

type TaskState = Record<TaskStatus, Task[]>;

export default function TasksContent() {
  const { fetchAllTasksUseCase } = useTask();

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
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Tarefas" />

        <View style={styles.content}>
          <TasksListCard tasks={tasks[TaskStatus.TODO]} status={TaskStatus.TODO} />
          <TasksListCard tasks={tasks[TaskStatus.DOING]} status={TaskStatus.DOING} />
          <TasksListCard tasks={tasks[TaskStatus.DONE]} status={TaskStatus.DONE} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.darkNavy,
  },
  safeArea: {
    flex: 1,
    backgroundColor: customColors.lightGray,
  },
  content: {
    flex: 1,
  },
});
