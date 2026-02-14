import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { ToggleLine } from './ToggleLine';

interface ToggleItem {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface ToggleOnlyCardProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items: ToggleItem[];
  cardStyle?: object;
}

export function ToggleOnlyCard({ title, icon, items, cardStyle }: ToggleOnlyCardProps) {
  return (
    <Card style={[styles.card, cardStyle]} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name={icon} size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {title}
          </Text>
        </View>

        {items.map((item, index) => (
          <ToggleLine
            key={index}
            title={item.title}
            description={item.description}
            value={item.value}
            onValueChange={item.onValueChange}
          />
        ))}
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
    flex: 1,
  },
});
