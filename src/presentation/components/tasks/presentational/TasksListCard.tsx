import { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Card, Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

import { ContentCard } from '../../shared/content-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;

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
      return { color: colors.yellow, label: 'Em Andamento' };
    }

    return { color: colors.secondary, label: 'Concluído' };
  }, [status, colors]);

  return (
    <ContentCard style={styles.contentCard}>
      <View style={styles.tasksHeader}>
        <Badge size={30} style={{ backgroundColor: statusVisualProperties.color }}>
          {tasks.length}
        </Badge>
        <Text variant="titleLarge" style={{ color: colors.text }}>
          {statusVisualProperties.label}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tasks.map((task) => (
          <Card
            key={task.id}
            style={[styles.taskCard, { backgroundColor: colors.surfaceVariant }]}
            theme={{ colors: { surface: colors.surfaceVariant } }}>
            <Card.Content>
              <Text variant="titleSmall" theme={{ colors: { onSurface: colors.text } }}>
                {task.title} - {task.createdAtLabel}
              </Text>
              <Text variant="bodyMedium" theme={{ colors: { onSurface: colors.textSecondary } }}>
                {task.shortDescription}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhuma tarefa {statusVisualProperties.label.toLowerCase()}
          </Text>
        )}
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
    width: CARD_WIDTH,
    marginRight: 0, // We'll handle spacing in the parent ScrollView
    marginHorizontal: 8,
    flex: 1,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
