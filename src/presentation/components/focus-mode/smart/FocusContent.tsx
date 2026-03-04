import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

import { useFocusSession } from '@/src/presentation/hooks/use-focus-session';

import { customColors } from '../../../constants';
import { FocusEmptyState } from '../presentational/FocusEmptyState';
import { FocusFinishDialog } from '../presentational/FocusFinishDialog';
import { FocusNextTaskInfo } from '../presentational/FocusNextTaskInfo';

export default function FocusContent() {
  const {
    currentTask,
    nextTask,
    loading,
    showConfirm,
    setShowConfirm,
    isActive,
    progress,
    isCronometro,
    formatTime,
    handleToggleTimer,
    handleNextTask,
  } = useFocusSession();

  if (loading) return null;

  if (!currentTask) {
    return <FocusEmptyState />;
  }

  return (
    <View style={[styles.container, { backgroundColor: customColors.lightGray }]}>
      <View style={styles.exitContainer}>
        <Button
          mode="contained"
          buttonColor={customColors.coral}
          onPress={() => router.back()}
          style={styles.exitButton}>
          Sair do Foco
        </Button>
      </View>

      <Card style={styles.card} elevation={3}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title}>{currentTask.title}</Text>
          <Text style={styles.description}>{currentTask.description}</Text>

          <View style={styles.timerWrapper}>
            <View style={styles.timerContainer}>
              <Svg width={220} height={220}>
                {/* Fundo cinza */}
                <Circle stroke={customColors.lightGray} fill="none" cx="110" cy="110" r="100" strokeWidth="10" />

                {/* Progresso */}
                <Circle
                  stroke={customColors.tealGreen}
                  fill="none"
                  cx="110"
                  cy="110"
                  r="100"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - progress)}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="110,110"
                />
              </Svg>

              <View style={styles.timerContent}>
                <Text style={styles.timerText}>{formatTime()}</Text>
                {!isCronometro && <Text style={styles.percentText}>{Math.round(progress * 100)}% concluído</Text>}
              </View>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <Button
              mode="contained"
              onPress={handleToggleTimer}
              disabled={isActive}
              buttonColor={customColors.tealGreen}
              style={styles.actionButton}>
              Iniciar
            </Button>

            <Button
              mode="contained"
              onPress={handleToggleTimer}
              disabled={!isActive}
              buttonColor={customColors.darkBorder}
              style={styles.actionButton}>
              Pausar
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor={customColors.skyBlue}
        style={styles.nextTaskButton}
        disabled={!nextTask}
        onPress={() => setShowConfirm(true)}>
        Próxima Tarefa
      </Button>

      <FocusNextTaskInfo nextTask={nextTask} />

      <FocusFinishDialog
        visible={showConfirm}
        taskTitle={currentTask.title}
        onDismiss={() => setShowConfirm(false)}
        onConfirm={handleNextTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  exitContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  exitButton: {
    borderRadius: 30,
  },
  card: {
    borderRadius: 16,
    backgroundColor: customColors.white,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  timerContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: customColors.darkBorder,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  timerWrapper: {
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  percentText: {
    fontSize: 13,
    color: customColors.darkBorder,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 30,
  },
  nextTaskButton: {
    marginTop: 30,
    borderRadius: 30,
  },
});
