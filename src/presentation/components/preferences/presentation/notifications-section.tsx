import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Card, Switch, Text } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

export function NotificationsSection() {
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(false);

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="notifications" size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Notificações
          </Text>
          <Badge style={styles.badge} size={20}>
            1
          </Badge>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Sons
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Alertas sonoros
            </Text>
          </View>
          <Switch value={sounds} onValueChange={setSounds} />
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Vibração
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Feedback tátil
            </Text>
          </View>
          <Switch value={vibration} onValueChange={setVibration} />
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
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: customColors.darkNavy,
    flex: 1,
  },
  badge: {
    backgroundColor: '#FFC107',
    color: customColors.darkNavy,
    position: 'absolute',
    right: 0,
    top: -4,
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
