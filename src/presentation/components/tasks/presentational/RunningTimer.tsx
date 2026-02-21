import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Task, TaskStatus } from '@/src/domain';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface RunningTimerProps {
  task: Task;
}

export function RunningTimer({ task }: RunningTimerProps) {
  const colors = useThemeColors();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (task.status !== TaskStatus.DOING || !task.statusChangedAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - task.statusChangedAt!.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      setElapsed(diffMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.status, task.statusChangedAt]);

  const totalMinutes = Number(elapsed.toFixed(2));
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.floor((totalMinutes - minutes) * 60);

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={[styles.timerText, { color: colors.textSecondary }]} testID="timer-text">
        {`${minutes}m ${seconds.toString().padStart(2, '0')}s`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
  },
  timerText: {
    fontWeight: 'bold',
  },
});
