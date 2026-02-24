import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { customColors } from '../../constants';
import { useFocusViewModel } from './hooks/useFocusViewModel';

export default function FocusScreen() {
  const {
    currentTask,
    nextTask,
    loading,
    showConfirm,
    setShowConfirm,
    isActive,
    progress,
    formatTime,
    handleToggleTimer,
    handleFinishTask,
  } = useFocusViewModel();

  if (loading) return null;

  if (!currentTask) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Nenhuma tarefa pendente encontrada.</Text>
        <Button onPress={() => router.back()}>Voltar</Button>
      </View>
    );
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
                <Text style={styles.percentText}>{Math.round(progress * 100)}% concluído</Text>
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
        onPress={() => setShowConfirm(true)}>
        Próxima Tarefa
      </Button>

      <View style={styles.nextTaskInfo}>
        <Text style={styles.nextTaskLabel}>Próxima tarefa:</Text>
        {nextTask ? (
          <>
            <Text style={styles.nextTaskTitle}>{nextTask.title}</Text>
            <Text style={styles.nextTaskDuration}>{nextTask.timeValue} min</Text>
          </>
        ) : (
          <Text style={styles.nextTaskTitle}>Não existem mais tarefas.</Text>
        )}
      </View>

      <Portal>
        <Dialog visible={showConfirm} onDismiss={() => setShowConfirm(false)}>
          <Dialog.Title>Finalizar Tarefa?</Dialog.Title>
          <Dialog.Content>
            <Text>Deseja marcar "{currentTask.title}" como concluída e ir para a próxima?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)}>Não</Button>
            <Button
              onPress={() => {
                handleFinishTask();
              }}>
              Sim
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: customColors.darkTextSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
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

  nextTaskInfo: {
    marginTop: 15,
  },

  nextTaskLabel: {
    fontSize: 12,
    color: customColors.darkBorder,
  },

  nextTaskTitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  nextTaskDuration: {
    fontSize: 12,
    color: customColors.darkBorder,
  },
});
