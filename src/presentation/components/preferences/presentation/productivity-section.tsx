import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

type PomodoroTime = '15 min' | '25 min' | '35 min' | '45 min';

export function ProductivitySection() {
  const [pomodoroTime, setPomodoroTime] = useState<PomodoroTime>('25 min');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="access-time" size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Tempo e Produtividade
          </Text>
        </View>

        <View style={styles.pomodoroContainer}>
          <Text variant="titleMedium" style={styles.itemTitle}>
            Pomodoro Padrão
          </Text>
          <View style={styles.pomodoroButtons}>
            {(['15 min', '25 min', '35 min', '45 min'] as PomodoroTime[]).map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.pomodoroButton, pomodoroTime === time && styles.pomodoroButtonActive]}
                onPress={() => setPomodoroTime(time)}
                accessibilityRole="button"
                accessibilityLabel={`Pomodoro de ${time}`}>
                <Text
                  style={[
                    styles.pomodoroButtonText,
                    pomodoroTime === time && styles.pomodoroButtonTextActive,
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Alto Contraste
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
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
    backgroundColor: customColors.white,
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
    color: customColors.darkNavy,
  },
  pomodoroContainer: {
    marginTop: spacing.md,
  },
  itemTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: customColors.darkNavy,
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
    backgroundColor: '#F0F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomodoroButtonActive: {
    backgroundColor: customColors.mediumBlue,
  },
  pomodoroButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: customColors.mediumGray,
  },
  pomodoroButtonTextActive: {
    color: customColors.white,
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
    color: customColors.mediumGray,
  },
});
