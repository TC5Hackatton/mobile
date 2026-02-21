import { useFocusTimer } from '@/src/presentation/hooks/use-focus-timer';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { customColors } from '../../constants';

export default function FocusScreen() {
  const { fetchAllTasksUseCase, updateTaskUseCase } = useTask();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  //Buscar a task mais antiga e pegar o tempo dela
  useEffect(() => {
    async function loadTasks() {
      const allTasks = await fetchAllTasksUseCase.execute();

      //Filtrar as task TODO e ordenar pela data de criação
      const pendingTasks = allTasks
        .filter((t) => t.status === TaskStatus.TODO)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setCurrentTask(pendingTasks[0] || null);
      setNextTask(pendingTasks[1] || null);
      setLoading(false);
    }
    loadTasks();
  }, []);

  const { formatTime, isActive, toggleTimer, progress } = useFocusTimer(currentTask?.timeValue || 25);

  const onConfirmNext = async () => {
    if (currentTask) {
      await handleFinishTask(currentTask);
    }
    setShowConfirm(false);
  };

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
          contentStyle={{ paddingHorizontal: 12 }}
          style={styles.exitButton}
          onPress={() => router.back()}
          accessibilityLabel="Botão para Sair do Foco"
          accessibilityHint="Pressione para sair da tela de foco e retornar à tela anterior">
          Sair do Foco
        </Button>
      </View>

      <Card style={styles.card} elevation={3}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title}>{currentTask.title}</Text>
          <Text style={styles.description}>{currentTask.description}</Text>

          <View style={styles.timerWrapper}>
            <View style={[styles.timerCircle, { borderColor: customColors.darkTextSecondary }]}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: customColors.mintTealLight,
                    opacity: 100,
                    borderRadius: 110,
                    transform: [{ scale: progress }],
                  },
                ]}
              />

              <Text style={styles.timerText}>{formatTime()}</Text>
              <Text style={styles.percentText}>{Math.round(progress * 100)}% concluído</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <Button
              mode="contained"
              onPress={toggleTimer}
              disabled={isActive}
              buttonColor={customColors.tealGreen}
              style={styles.actionButton}>
              Iniciar
            </Button>

            <Button
              mode="contained"
              onPress={toggleTimer}
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
        contentStyle={{ paddingVertical: 10 }}>
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
            <Text>Tem certeza que deseja finalizar a tarefa atual?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)}>Não</Button>
            <Button onPress={onConfirmNext}>Sim</Button>
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
