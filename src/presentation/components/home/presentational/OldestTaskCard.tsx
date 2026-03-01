import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Task } from '@/src/domain';
import { spacing } from '@/src/presentation/constants';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import OldestEmptyCard from './OldestEmptyCard';

type OldestTaskCardProps = {
  task: Task | null;
};

export default function OldestTaskCard({ task }: OldestTaskCardProps) {
  const colors = useThemeColors();
  const { fontSize, lineHeight } = useFontSize();

  if (!task) {
    return <OldestEmptyCard />;
  }

  return (
    <View style={[styles.innerCard, { backgroundColor: colors.surfaceVariant }]}>
      <View style={styles.priorityTaskHeader}>
        <Text
          variant="titleMedium"
          style={[styles.priorityTaskTitle, { fontSize: fontSize.md, fontFamily: typography.fontFamily.semiBold }]}
          theme={{ colors: { onSurface: colors.text } }}>
          {task.title}
        </Text>
        <View style={styles.priorityTaskMeta}>
          <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
          <Text
            variant="bodySmall"
            style={[styles.priorityTaskTime, { fontSize: fontSize.sm }]}
            theme={{ colors: { onSurface: colors.textSecondary } }}>
            {task.createdAtLabel}
          </Text>
        </View>
      </View>

      <View style={styles.priorityTaskTagContainer}>
        <View style={[styles.priorityTaskTag, { backgroundColor: colors.tertiary }]}>
          <Text
            variant="labelSmall"
            style={[styles.priorityTaskTagText, { fontSize: fontSize.xs, fontFamily: typography.fontFamily.medium }]}
            theme={{ colors: { onSurface: colors.white } }}>
            {task.statusLabel}
          </Text>
        </View>
      </View>

      <Text
        variant="bodyMedium"
        style={[styles.priorityTaskDescription, { fontSize: fontSize.sm, lineHeight: lineHeight.sm }]}
        theme={{ colors: { onSurface: colors.textSecondary } }}>
        {task.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  innerCard: {
    borderRadius: 12,
    padding: spacing.md,
  },
  priorityTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  priorityTaskTitle: {
    flex: 1,
  },
  priorityTaskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  priorityTaskTime: {},
  priorityTaskTagContainer: {
    marginBottom: spacing.md,
  },
  priorityTaskTag: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  priorityTaskTagText: {},
  priorityTaskDescription: {},
});
