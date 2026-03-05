import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { Settings } from '@/src/domain';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface ProductivitySectionProps {
  amountDefault: number;
  onAmountDefaultChange: (minutes: number) => void;
}

export function ProductivitySection({ amountDefault, onAmountDefaultChange }: ProductivitySectionProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

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
            Tempo Padrão
          </Text>
          <View style={styles.pomodoroButtons}>
            {Settings.VALID_AMOUNT_DEFAULTS.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.pomodoroButton,
                  { backgroundColor: colors.surfaceVariant },
                  amountDefault === minutes && { backgroundColor: colors.primary },
                ]}
                onPress={() => onAmountDefaultChange(minutes)}
                accessibilityRole="button"
                accessibilityLabel={`Pomodoro de ${minutes} min`}>
                <Text
                  style={[
                    styles.pomodoroButtonText,
                    { color: colors.textSecondary, fontSize: fontSize.sm },
                    amountDefault === minutes && { color: colors.white },
                  ]}>
                  {minutes} min
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
    fontFamily: typography.fontFamily.bold,
  },
  itemTitle: {
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
    fontFamily: typography.fontFamily.medium,
  },
});
