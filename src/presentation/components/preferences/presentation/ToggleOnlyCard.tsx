import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
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
  const colors = useThemeColors();
  const { fontSize } = useFontSize();
  
  return (
    <Card 
      style={[styles.card, { backgroundColor: colors.surface }, cardStyle]} 
      mode="elevated" 
      elevation={2}
      theme={{ colors: { surface: colors.surface } }}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name={icon} size={24} color={colors.text} />
          <Text 
            variant="titleLarge" 
            style={[styles.sectionTitle, { fontSize: fontSize.lg }]}
            theme={{ colors: { onSurface: colors.text } }}>
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
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.bold,
    flex: 1,
  },
});
