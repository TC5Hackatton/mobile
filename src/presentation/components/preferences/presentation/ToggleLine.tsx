import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';

interface ToggleLineProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function ToggleLine({ title, description, value, onValueChange }: ToggleLineProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();
  
  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text 
          variant="titleMedium" 
          style={[styles.itemTitle, { fontSize: fontSize.md }]}
          theme={{ colors: { onSurface: colors.text } }}>
          {title}
        </Text>
        <Text 
          variant="bodySmall" 
          style={[styles.itemSubtitle, { fontSize: fontSize.sm }]}
          theme={{ colors: { onSurface: colors.textSecondary } }}>
          {description}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: typography.fontFamily.regular,
  },
});
