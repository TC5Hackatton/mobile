import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserTaskStatistics } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { FloatingActionButton } from '@/src/presentation/components/shared/floating-action-button';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import OldestTaskCard from '../presentational/OldestTaskCard';
import StatCard from '../presentational/StatCard';

export default function HomeContent() {
  const colors = useThemeColors();
  const { fontSize, lineHeight } = useFontSize();
  const { fetchStatisticsFromUserTasksUseCase } = useTask();

  const [statistics, setStatistics] = useState<UserTaskStatistics>({
    oldestTask: null,
    progress: { completed: 0, total: 0 },
    totalFocusTime: '0 min',
    taskCounts: { todo: 0, doing: 0, done: 0, total: 0 },
  });

  const { oldestTask, progress, totalFocusTime, taskCounts } = statistics;

  useFocusEffect(
    useCallback(() => {
      fetchStatisticsFromUserTasksUseCase.execute().then(setStatistics);
    }, [fetchStatisticsFromUserTasksUseCase]),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={[]}>
        <AppHeader title="Início" />

        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.dailyCardsContainer}>
            <Card
              style={[styles.dailyCard, { backgroundColor: colors.surface }]}
              theme={{ colors: { surface: colors.surface } }}>
              <Card.Content style={styles.dailyCardContent}>
                <Text
                  variant="headlineLarge"
                  style={[styles.dailyCardValue, { fontSize: fontSize.xxl }]}
                  theme={{ colors: { onSurface: colors.primary } }}>
                  {progress.total > 0 ? `${progress.completed}/${progress.total}` : '0'}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[styles.dailyCardLabel, { fontSize: fontSize.sm }]}
                  theme={{ colors: { onSurface: colors.textSecondary } }}>
                  Tarefas Concluídas
                </Text>
              </Card.Content>
            </Card>

            <Card
              style={[styles.dailyCard, { backgroundColor: colors.surface }]}
              theme={{ colors: { surface: colors.surface } }}>
              <Card.Content style={styles.dailyCardContent}>
                <Text
                  variant="headlineLarge"
                  style={[styles.dailyCardValue, { fontSize: fontSize.xxl }]}
                  theme={{ colors: { onSurface: colors.secondary } }}>
                  {totalFocusTime}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[styles.dailyCardLabel, { fontSize: fontSize.sm }]}
                  theme={{ colors: { onSurface: colors.textSecondary } }}>
                  Tempo Trabalhado
                </Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.section}>
            <Card
              style={[styles.sectionCard, { backgroundColor: colors.surface }]}
              theme={{ colors: { surface: colors.surface } }}>
              <Card.Content>
                <Text variant="titleLarge" style={[styles.sectionTitle, { fontSize: fontSize.xxl }]} theme={{ colors: { onSurface: colors.text } }}>
                  Tarefa Mais Antiga
                </Text>

                <OldestTaskCard task={oldestTask} />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.section}>
            <Card
              style={[styles.sectionCard, { backgroundColor: colors.surface }]}
              theme={{ colors: { surface: colors.surface } }}>
              <Card.Content style={styles.sectionCardContent}>
                <Text variant="titleLarge" style={[styles.sectionTitle, { fontSize: fontSize.lg }]} theme={{ colors: { onSurface: colors.text } }}>
                  Progresso Semanal
                </Text>

                <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceVariant }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: progress.total > 0 ? `${(progress.completed / progress.total) * 100}%` : '0%' },
                    ]}>
                    <LinearGradient
                      colors={[colors.tertiary, colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressBarGradient}
                    />
                  </View>
                  <View style={[styles.progressBarEmpty, { backgroundColor: colors.surfaceVariant }]} />
                </View>

                <View style={styles.weeklyStatsGrid}>
                  <StatCard icon="pending" iconColor={colors.textSecondary} value={taskCounts.todo} label="A Fazer" />
                  <StatCard
                    icon="timelapse"
                    iconColor={colors.secondary}
                    value={taskCounts.doing}
                    label="Em Andamento"
                  />
                  <StatCard
                    icon="check-circle-outline"
                    iconColor={colors.primary}
                    value={taskCounts.done}
                    label="Concluídas"
                  />
                  <StatCard
                    icon="group-work"
                    iconColor={colors.coral}
                    value={taskCounts.total}
                    label="Tarefas Totais"
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>

        <FloatingActionButton />
      </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  dailyCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  dailyCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dailyCardContent: {
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  dailyCardValue: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },
  dailyCardLabel: {
    // fontSize definido dinamicamente via useFontSize hook
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionCardContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
  },
  weeklyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  progressBarContainer: {
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    position: 'relative',
  },
  progressBarGradient: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  progressBarEmpty: {
    flex: 1,
    height: '100%',
  },
});
