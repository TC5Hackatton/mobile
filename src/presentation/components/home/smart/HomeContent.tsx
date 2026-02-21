import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Task } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { FloatingActionButton } from '@/src/presentation/components/shared/floating-action-button';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import OldestTaskCard from '../presentational/OldestTaskCard';

const mockData = {
  daily: {
    tasksCompleted: { current: 3, total: 8 },
    timeWorked: '45 min',
    pomodoroSessions: 2,
  },
  weekly: {
    progress: 0.67,
    tasksCompleted: 15,
    focusTime: '3h 45min',
    activeStreak: '5 dias',
    vsLastWeek: '+20%',
  },
};

export default function HomeContent() {
  const colors = useThemeColors();
  const { fetchOldestTodoStatusUseCase, getTaskProgressUseCase, getTotalFocusTimeUseCase } = useTask();

  const [oldestTask, setOldestTask] = useState<Task | null>(null);

  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [totalTime, setTotalTime] = useState('0 min');

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchOldestTodoStatusUseCase.execute(),
        getTaskProgressUseCase.execute(),
        getTotalFocusTimeUseCase.execute(),
      ]).then(([task, progressData, time]) => {
        setOldestTask(task);
        setProgress(progressData);
        setTotalTime(time);
      });
    }, [fetchOldestTodoStatusUseCase, getTaskProgressUseCase, getTotalFocusTimeUseCase]),
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
                  style={styles.dailyCardValue}
                  theme={{ colors: { onSurface: colors.primary } }}>
                  {progress.total > 0 ? `${progress.completed}/${progress.total}` : '0'}
                </Text>
                <Text
                  variant="bodySmall"
                  style={styles.dailyCardLabel}
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
                  style={styles.dailyCardValue}
                  theme={{ colors: { onSurface: colors.secondary } }}>
                  {totalTime}
                </Text>
                <Text
                  variant="bodySmall"
                  style={styles.dailyCardLabel}
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
                <Text variant="titleLarge" style={styles.sectionTitle} theme={{ colors: { onSurface: colors.text } }}>
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
                <Text variant="titleLarge" style={styles.sectionTitle} theme={{ colors: { onSurface: colors.text } }}>
                  Progresso Semanal
                </Text>

                <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceVariant }]}>
                  <View style={[styles.progressBarFill, { width: `${mockData.weekly.progress * 100}%` }]}>
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
                  <View style={[styles.weeklyInnerCard, { backgroundColor: colors.surfaceVariant }]}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="gps-fixed" size={24} color={colors.secondary} />
                      <Text
                        variant="headlineMedium"
                        style={styles.weeklyStatValue}
                        theme={{ colors: { onSurface: colors.text } }}>
                        {mockData.weekly.tasksCompleted}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={styles.weeklyStatLabel}
                        theme={{ colors: { onSurface: colors.textSecondary } }}>
                        Tarefas Concluídas
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.weeklyInnerCard, { backgroundColor: colors.surfaceVariant }]}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="timer" size={24} color={colors.textSecondary} />
                      <Text
                        variant="headlineMedium"
                        style={styles.weeklyStatValue}
                        theme={{ colors: { onSurface: colors.text } }}>
                        {mockData.weekly.focusTime}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={styles.weeklyStatLabel}
                        theme={{ colors: { onSurface: colors.textSecondary } }}>
                        Tempo de Foco
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.weeklyInnerCard, { backgroundColor: colors.surfaceVariant }]}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="local-fire-department" size={24} color={colors.coral} />
                      <Text
                        variant="headlineMedium"
                        style={styles.weeklyStatValue}
                        theme={{ colors: { onSurface: colors.text } }}>
                        {mockData.weekly.activeStreak}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={styles.weeklyStatLabel}
                        theme={{ colors: { onSurface: colors.textSecondary } }}>
                        Sequência Ativa
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.weeklyInnerCard, { backgroundColor: colors.surfaceVariant }]}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="trending-up" size={24} color={colors.primary} />
                      <Text
                        variant="headlineMedium"
                        style={styles.weeklyStatValue}
                        theme={{ colors: { onSurface: colors.text } }}>
                        {mockData.weekly.vsLastWeek}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={styles.weeklyStatLabel}
                        theme={{ colors: { onSurface: colors.textSecondary } }}>
                        vs Semana Passada
                      </Text>
                    </View>
                  </View>
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
    fontSize: 28,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },
  dailyCardLabel: {
    fontSize: typography.fontSize.sm,
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
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
  },
  innerCard: {
    borderRadius: 12,
    padding: spacing.md,
  },
  weeklyInnerCard: {
    borderRadius: 12,
    padding: spacing.md,
    width: '48%',
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
  weeklyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  weeklyStatContent: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  weeklyStatLabel: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
