import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Card, Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

import { ContentCard } from '../../shared/content-card';

type TaskListCardProps = {
  tasks: Task[];
  status: TaskStatus;
};

export default function TasksListCard({ tasks, status }: TaskListCardProps) {
  const colors = useThemeColors();
  
  const statusVisualProperties = useMemo(() => {
    if (status === TaskStatus.TODO) {
      return { color: colors.tertiary, label: 'A Fazer' };
    }

    if (status === TaskStatus.DOING) {
      return { color: colors.yellow, label: 'Fazendo' };
    }

    return { color: colors.secondary, label: 'Concluído' };
  }, [status, colors]);

  if (!tasks.length) {
    return null;
  }

  return (
    <ContentCard style={styles.contentCard}>
      <View style={styles.tasksHeader}>
        <Badge style={{ backgroundColor: statusVisualProperties.color }}>{tasks.length}</Badge>
        <Text style={{ color: colors.text }}>{statusVisualProperties.label}</Text>
      </View>

      <ScrollView>
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            style={[styles.taskCard, { backgroundColor: colors.surfaceVariant }]}
            theme={{ colors: { surface: colors.surfaceVariant } }}>
            <Card.Content>
              <Text 
                variant="headlineSmall"
                theme={{ colors: { onSurface: colors.text } }}>
                {task.title}
              </Text>
              <Text 
                variant="bodyMedium"
                theme={{ colors: { onSurface: colors.textSecondary } }}>
                {task.description}
              </Text>
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
  contentCard: {
    maxHeight: 200,
  },
});
