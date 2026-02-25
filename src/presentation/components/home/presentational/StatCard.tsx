import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface StatCardProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
  value: number;
  label: string;
}

export default function StatCard({ icon, iconColor, value, label }: StatCardProps) {
  const colors = useThemeColors();

  return (
    <View testID="stat-card" style={[styles.container, { backgroundColor: colors.surfaceVariant }]}>
      <MaterialIcons name={icon} size={24} color={iconColor} />
      <Text
        testID="stat-card-value"
        variant="headlineMedium"
        style={styles.value}
        theme={{ colors: { onSurface: colors.text } }}>
        {value}
      </Text>
      <Text
        testID="stat-card-label"
        variant="bodySmall"
        style={styles.label}
        theme={{ colors: { onSurface: colors.textSecondary } }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    width: '48%',
    alignItems: 'center',
  },
  value: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
