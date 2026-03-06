import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface FocusModeSectionProps {
  onPress: () => void;
}

export function FocusModeSection({ onPress }: FocusModeSectionProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surface }]}
      mode="elevated"
      elevation={2}
      theme={{ colors: { surface: colors.surface } }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card.Content style={styles.content}>
          <View style={styles.row}>
            <View style={styles.left}>
              <MaterialIcons name="psychology" size={24} color={colors.text} />
              <View>
                <Text
                  variant="titleMedium"
                  style={[styles.title, { fontSize: fontSize.md }]}
                  theme={{ colors: { onSurface: colors.text } }}>
                  Modo Foco
                </Text>
                <Text
                  variant="bodySmall"
                  style={[styles.subtitle, { fontSize: fontSize.sm }]}
                  theme={{ colors: { onSurface: colors.textSecondary } }}>
                  Foco total em uma tarefa
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </View>
        </Card.Content>
      </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.medium,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
});
