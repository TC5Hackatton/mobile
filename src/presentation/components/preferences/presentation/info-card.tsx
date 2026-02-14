import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

export function InfoCard() {
  return (
    <Card style={styles.card} mode="flat">
      <Card.Content style={styles.content}>
        <MaterialIcons name="settings" size={24} color={customColors.mediumBlue} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.title}>
            Configurações pensadas para você
          </Text>
          <Text variant="bodySmall" style={styles.description}>
            Ajuste conforme sua necessidade. Não existe 'jeito certo' - o que funciona para você é o melhor.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.lightBlue,
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
    color: customColors.darkNavy,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: customColors.mediumGray,
    lineHeight: typography.lineHeight.sm,
  },
});
