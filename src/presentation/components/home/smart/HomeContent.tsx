import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { FloatingActionButton } from '@/src/presentation/components/shared/floating-action-button';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';
import { useTask } from '@/src/presentation/contexts/TaskContext';

// Dados mockados
const mockData = {
  daily: {
    tasksCompleted: { current: 3, total: 8 },
    timeWorked: '45 min',
    pomodoroSessions: 2,
  },
  priorityTask: {
    title: 'Estudar React',
    status: 'A Fazer',
    time: '25 min',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis non orci id cursus. Integer non iaculis magna. Duis ultricies, lorem quis pulvinar vulputate, erat mauris egestas sem.',
  },
  weekly: {
    progress: 0.67, // 67% aproximadamente 2/3
    tasksCompleted: 15,
    focusTime: '3h 45min',
    activeStreak: '5 dias',
    vsLastWeek: '+20%',
  },
};

export default function HomeContent() {
  const { logger } = useDependencies();
  const { createTaskUseCase } = useTask();

  const handleFABPress = () => {
    // TODO: remover isso assim que a criação de tarefa for implementada
    createTaskUseCase.execute({
      title: 'Nova tarefa',
      description: 'Nova tarefa',
      status: TaskStatus.TODO,
      timeSpent: 0,
      timeType: 'minutes',
    });

    // TODO: Implementar ação do FAB
    logger.log('FAB pressed');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Início" />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Cards de Resumo Diário */}
          <View style={styles.dailyCardsContainer}>
            <Card style={styles.dailyCard}>
              <Card.Content style={styles.dailyCardContent}>
                <Text style={styles.dailyCardValue} variant="headlineLarge">
                  {mockData.daily.tasksCompleted.current}/{mockData.daily.tasksCompleted.total}
                </Text>
                <Text style={styles.dailyCardLabel} variant="bodySmall">
                  Tarefas Concluídas
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.dailyCard}>
              <Card.Content style={styles.dailyCardContent}>
                <Text style={[styles.dailyCardValue, styles.dailyCardValueGreen]} variant="headlineLarge">
                  {mockData.daily.timeWorked}
                </Text>
                <Text style={styles.dailyCardLabel} variant="bodySmall">
                  Tempo Trabalhado
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.dailyCard}>
              <Card.Content style={styles.dailyCardContent}>
                <Text style={[styles.dailyCardValue, styles.dailyCardValueOrange]} variant="headlineLarge">
                  {mockData.daily.pomodoroSessions}
                </Text>
                <Text style={styles.dailyCardLabel} variant="bodySmall">
                  Sessões Pomodoro
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Seção Tarefas Prioritárias */}
          <View style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionCardContent}>
                <Text style={styles.sectionTitle} variant="titleLarge">
                  Tarefas Prioritárias
                </Text>

                <View style={styles.innerCard}>
                  <View style={styles.priorityTaskHeader}>
                    <Text style={styles.priorityTaskTitle} variant="titleMedium">
                      {mockData.priorityTask.title}
                    </Text>
                    <View style={styles.priorityTaskMeta}>
                      <MaterialIcons name="schedule" size={16} color={customColors.mediumGray} />
                      <Text style={styles.priorityTaskTime} variant="bodySmall">
                        {mockData.priorityTask.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priorityTaskTagContainer}>
                    <View style={styles.priorityTaskTag}>
                      <Text style={styles.priorityTaskTagText} variant="labelSmall">
                        {mockData.priorityTask.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.priorityTaskDescription} variant="bodyMedium">
                    {mockData.priorityTask.description}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Seção Progresso Semanal */}
          <View style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionCardContent}>
                <Text style={styles.sectionTitle} variant="titleLarge">
                  Progresso Semanal
                </Text>

                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${mockData.weekly.progress * 100}%` }]}>
                    <LinearGradient
                      colors={['#6B9BD0', '#9ACA69']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressBarGradient}
                    />
                  </View>
                  <View style={styles.progressBarEmpty} />
                </View>

                <View style={styles.weeklyStatsGrid}>
                  <View style={styles.weeklyInnerCard}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="gps-fixed" size={24} color={customColors.tealGreen} />
                      <Text style={styles.weeklyStatValue} variant="headlineMedium">
                        {mockData.weekly.tasksCompleted}
                      </Text>
                      <Text style={styles.weeklyStatLabel} variant="bodySmall">
                        Tarefas Concluídas
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weeklyInnerCard}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="timer" size={24} color={customColors.darkBlueGray} />
                      <Text style={styles.weeklyStatValue} variant="headlineMedium">
                        {mockData.weekly.focusTime}
                      </Text>
                      <Text style={styles.weeklyStatLabel} variant="bodySmall">
                        Tempo de Foco
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weeklyInnerCard}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="local-fire-department" size={24} color={customColors.coral} />
                      <Text style={styles.weeklyStatValue} variant="headlineMedium">
                        {mockData.weekly.activeStreak}
                      </Text>
                      <Text style={styles.weeklyStatLabel} variant="bodySmall">
                        Sequência Ativa
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weeklyInnerCard}>
                    <View style={styles.weeklyStatContent}>
                      <MaterialIcons name="trending-up" size={24} color={customColors.mediumBlue} />
                      <Text style={styles.weeklyStatValue} variant="headlineMedium">
                        {mockData.weekly.vsLastWeek}
                      </Text>
                      <Text style={styles.weeklyStatLabel} variant="bodySmall">
                        vs Semana Passada
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>

        <FloatingActionButton
          onPress={handleFABPress}
          accessibilityLabel="Adicionar novo item"
          accessibilityHint="Abre a tela para adicionar um novo item"
        />
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
    backgroundColor: customColors.white,
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
    color: customColors.mediumBlue,
    marginBottom: spacing.xs,
  },
  dailyCardValueGreen: {
    color: customColors.tealGreen,
  },
  dailyCardValueOrange: {
    color: customColors.coral,
  },
  dailyCardLabel: {
    fontSize: typography.fontSize.sm,
    color: customColors.mediumGray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionCard: {
    borderRadius: 12,
    backgroundColor: customColors.white,
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
    color: customColors.darkNavy,
    marginBottom: spacing.md,
  },
  innerCard: {
    borderRadius: 12,
    backgroundColor: '#F0F5F9',
    padding: spacing.md,
  },
  weeklyInnerCard: {
    borderRadius: 12,
    backgroundColor: '#F0F5F9',
    padding: spacing.md,
    width: '48%',
  },
  priorityTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  priorityTaskTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: customColors.darkNavy,
    flex: 1,
  },
  priorityTaskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  priorityTaskTime: {
    fontSize: typography.fontSize.sm,
    color: customColors.mediumGray,
  },
  priorityTaskTagContainer: {
    marginBottom: spacing.md,
  },
  priorityTaskTag: {
    backgroundColor: '#B3D9F2',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  priorityTaskTagText: {
    fontSize: typography.fontSize.xs,
    color: customColors.darkNavy,
    fontFamily: typography.fontFamily.medium,
  },
  priorityTaskDescription: {
    fontSize: typography.fontSize.sm,
    color: customColors.mediumGray,
    lineHeight: typography.lineHeight.sm,
  },
  progressBarContainer: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F0F5F9',
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
    backgroundColor: '#F0F5F9',
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
    color: customColors.darkNavy,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  weeklyStatLabel: {
    fontSize: typography.fontSize.sm,
    color: customColors.mediumGray,
    textAlign: 'center',
  },
});
