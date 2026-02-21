import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { spacing } from '@/src/presentation/constants/spacing';
import { useFocusTimer } from '@/src/presentation/hooks/use-focus-timer';

export default function FocusScreen() {
  const colors = useThemeColors();
  const { formatTime, isActive, toggleTimer } = useFocusTimer(25);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={{ color: colors.text, marginBottom: spacing.lg }}>
          Estudar React
        </Text>

        <View style={[styles.timerCircle, { borderColor: colors.outlineVariant }]}>
          <Text style={[styles.timerText, { color: colors.primary }]}>{formatTime()}</Text>
          <Text style={{ color: colors.textSecondary }}>0% concluído</Text>
        </View>

        <View style={styles.controls}>
          <Button
            mode="contained"
            onPress={toggleTimer}
            buttonColor={isActive ? colors.error : colors.primary}
            style={styles.button}>
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>

          <Button mode="outlined" onPress={() => {}} style={[styles.button, { marginTop: spacing.md }]}>
            Próxima Tarefa
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  controls: {
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 12,
  },
});
