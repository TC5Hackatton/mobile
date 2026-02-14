import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Task, TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { ContentCard } from '@/src/presentation/components/shared/content-card';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useState } from 'react';

export default function TasksContent() {
  const { createTaskUseCase, fetchAllTasksUseCase } = useTask();

  const [tasks, setTasks] = useState<Task[]>([]);

  const handleFABPress = () => {
    // TODO: remover UseCases assim que a criação de tarefa for implementada
    createTaskUseCase.execute({
      title: `[${Math.random().toString(36).substring(2, 9)}] Título de exemplo`,
      description: 'Descrição de exemplo',
      status: TaskStatus.TODO,
      timeSpent: 0,
      timeType: 'minutes',
    });

    fetchAllTasksUseCase.execute().then((tasks) => {
      setTasks(tasks);
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Tarefas" />

        <Button onPress={handleFABPress}>Exemplo Demonstrativo</Button>

        <View style={styles.content}>
          {!!tasks.length && (
            <ContentCard>
              <View style={styles.tasksHeader}>
                <Badge>{tasks.length}</Badge>
                <Text>A Fazer</Text>
              </View>

              <ScrollView>
                {tasks.map((task) => (
                  <Card key={task.id} style={styles.taskCard}>
                    <Card.Content>
                      <Text variant="headlineSmall">{task.title}</Text>
                      <Text variant="bodyMedium">{task.description}</Text>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            </ContentCard>
          )}
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
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  taskCard: {
    marginBottom: 16,
  },
});
