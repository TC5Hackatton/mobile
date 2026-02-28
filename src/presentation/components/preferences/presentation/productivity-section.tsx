import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

type PomodoroTime = '15 min' | '25 min' | '35 min' | '45 min';

export function ProductivitySection() {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();
  const [pomodoroTime, setPomodoroTime] = useState<PomodoroTime>('25 min');

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surface }]}
      mode="elevated"
      elevation={2}
      theme={{ colors: { surface: colors.surface } }}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="access-time" size={24} color={colors.text} />
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { fontSize: fontSize.lg }]}
            theme={{ colors: { onSurface: colors.text } }}>
            Tempo e Produtividade
          </Text>
        </View>

        <View>
          <Text
            variant="titleMedium"
            style={[styles.itemTitle, { fontSize: fontSize.md }]}
            theme={{ colors: { onSurface: colors.text } }}>
            Pomodoro Padrão
          </Text>
          <View style={styles.pomodoroButtons}>
            {(['15 min', '25 min', '35 min', '45 min'] as PomodoroTime[]).map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.pomodoroButton,
                  { backgroundColor: colors.surfaceVariant },
                  pomodoroTime === time && { backgroundColor: colors.primary },
                ]}
                onPress={() => setPomodoroTime(time)}
                accessibilityRole="button"
                accessibilityLabel={`Pomodoro de ${time}`}>
                <Text
                  style={[
                    styles.pomodoroButtonText,
                    { color: colors.textSecondary, fontSize: fontSize.sm },
                    pomodoroTime === time && { color: colors.white },
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.bold,
  },
  itemTitle: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.sm,
  },
  pomodoroButtons: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  pomodoroButton: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomodoroButtonText: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.medium,
  },
});
