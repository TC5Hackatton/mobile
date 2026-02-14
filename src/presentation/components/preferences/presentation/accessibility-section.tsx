import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

export function AccessibilitySection() {
  const [reducedAnimations, setReducedAnimations] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="accessibility-new" size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Acessibilidade
          </Text>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Animações Reduzidas
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Menos movimento na tela
            </Text>
          </View>
          <Switch value={reducedAnimations} onValueChange={setReducedAnimations} />
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Modo Simplificado
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Interface mais básica
            </Text>
          </View>
          <Switch value={simplifiedMode} onValueChange={setSimplifiedMode} />
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
    marginBottom: spacing.xxl,
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: customColors.darkNavy,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: customColors.mediumGray,
  },
});
