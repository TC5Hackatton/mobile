import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Card, Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { customColors } from '@/src/presentation/constants/paper-theme';

import { useMemo } from 'react';
import { ContentCard } from '../../shared/content-card';

type TaskListCardProps = {
  tasks: Task[];
  status: TaskStatus;
};

export default function TasksListCard({ tasks, status }: TaskListCardProps) {
  const statusVisualProperties = useMemo(() => {
    if (status === TaskStatus.TODO) {
      return { color: customColors.skyBlue, label: 'A Fazer' };
    }

    if (status === TaskStatus.DOING) {
      return { color: customColors.yellow, label: 'Fazendo' };
    }

    return { color: customColors.tealGreen, label: 'Concluído' };
  }, [status]);

  if (!tasks.length) {
    return null;
  }

  return (
    <ContentCard>
      <View style={styles.tasksHeader}>
        <Badge style={{ backgroundColor: statusVisualProperties.color }}>{tasks.length}</Badge>
        <Text>{statusVisualProperties.label}</Text>
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
  );
}

const styles = StyleSheet.create({
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
