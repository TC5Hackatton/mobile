import { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

import { ContentCard } from '../../shared/content-card';
import { TaskWithLabel } from '../smart/TasksContent';
import { RunningTimer } from './RunningTimer';
import { TaskActionButton } from './TaskActionButton';
import { TaskLabelsList } from './TaskLabelsList';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;

type TaskListCardProps = {
  tasks: TaskWithLabel[];
  status: TaskStatus;
  onPressStart?: (task: Task) => void;
  onPressFinish?: (task: Task) => void;
  onPressPause?: (task: Task) => void;
};

export default function TasksListCard({ tasks, status, onPressStart, onPressFinish, onPressPause }: TaskListCardProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

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
        <View
          testID="status-badge"
          style={[styles.badge, { backgroundColor: statusVisualProperties.color }]}>
          <Text style={[styles.badgeText, { color: colors.text, fontSize: fontSize.sm }]}>
            {tasks.length}
          </Text>
        </View>
        <Text variant="titleLarge" style={{ color: colors.text, fontSize: fontSize.md }}>
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
              <View style={styles.cardHeader}>
                <View style={styles.headerInfo}>
                  <Text variant="titleMedium" style={{ color: colors.text, fontSize: fontSize.md }}>
                    {task.title}
                  </Text>
                  <View style={styles.labelsRow}>
                    <TaskLabelsList labels={task.labels} />
                  </View>
                </View>
                <View style={styles.headerActions}>
                  <TaskActionButton
                    status={task.status}
                    onPressStart={() => onPressStart?.(task)}
                    onPressFinish={() => onPressFinish?.(task)}
                    onPressPause={() => onPressPause?.(task)}
                  />
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text variant="bodyMedium" style={{ color: colors.textSecondary, fontSize: fontSize.md }}>
                  {task.shortDescription}
                </Text>
                <View style={styles.footerRow}>
                  <Text variant="bodySmall" style={[styles.dateText, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
                    {task.createdAtLabel}
                  </Text>
                  {task.status === TaskStatus.DOING && <RunningTimer task={task} />}
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
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
  badge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
  },
  taskCard: {
    marginBottom: 16,
  },
  contentCard: {
    width: CARD_WIDTH,
    marginRight: 0,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBody: {
    marginTop: 4,
  },
  dateText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  timerContainer: {
    marginLeft: 'auto',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
});
