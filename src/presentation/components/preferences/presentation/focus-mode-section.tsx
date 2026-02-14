import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

export function FocusModeSection() {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [currentTaskOnly, setCurrentTaskOnly] = useState(false);

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="psychology" size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Modo Foco
          </Text>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Ocultar Concluídas
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Menos distrações visuais
            </Text>
          </View>
          <Switch value={hideCompleted} onValueChange={setHideCompleted} />
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Apenas Tarefa Atual
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Foco total em uma coisa
            </Text>
          </View>
          <Switch value={currentTaskOnly} onValueChange={setCurrentTaskOnly} />
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
