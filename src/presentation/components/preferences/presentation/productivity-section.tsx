import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

type PomodoroTime = '15 min' | '25 min' | '35 min' | '45 min';

export function ProductivitySection() {
  const colors = useThemeColors();
  const [pomodoroTime, setPomodoroTime] = useState<PomodoroTime>('25 min');
  const [highContrast, setHighContrast] = useState(false);

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
            style={styles.sectionTitle}
            theme={{ colors: { onSurface: colors.text } }}>
            Tempo e Produtividade
          </Text>
        </View>

        <View style={styles.pomodoroContainer}>
          <Text 
            variant="titleMedium" 
            style={styles.itemTitle}
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
                    { color: colors.textSecondary },
                    pomodoroTime === time && { color: colors.white },
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text 
              variant="titleMedium" 
              style={styles.itemTitle}
              theme={{ colors: { onSurface: colors.text } }}>
              Alto Contraste
            </Text>
            <Text 
              variant="bodySmall" 
              style={styles.itemSubtitle}
              theme={{ colors: { onSurface: colors.textSecondary } }}>
              Para melhor legibilidade
            </Text>
          </View>
          <Switch value={highContrast} onValueChange={setHighContrast} />
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
    marginBottom: spacing.lg,
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
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  pomodoroContainer: {
    marginTop: spacing.md,
  },
  itemTitle: {
    fontSize: typography.fontSize.md,
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
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  itemContent: {
    flex: 1,
  },
  itemSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
});
