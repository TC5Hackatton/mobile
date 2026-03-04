import { Task } from '@/src/domain';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { customColors } from '../../../constants';

interface Props {
  nextTask: Task | null;
}

export function FocusNextTaskInfo({ nextTask }: Props) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
