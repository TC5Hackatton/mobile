import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

export function InfoCard() {
  const colors = useThemeColors();

  return (
    <Card style={[styles.card, { backgroundColor: colors.secondary }]} mode="elevated">
      <Card.Content style={styles.content}>
        <MaterialIcons name="settings" size={24} color={colors.text} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text
            variant="titleMedium"
            style={styles.title}
            theme={{ colors: { onSurface: colors.text } }}>
            Configurações pensadas para você
          </Text>
          <Text
            variant="bodySmall"
            style={styles.description}
            theme={{ colors: { onSurface: colors.text } }}>
            Ajuste conforme sua necessidade. Não existe 'jeito certo' - o que funciona para você é o melhor.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  icon: {
    marginTop: spacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeight.sm,
  },
});
