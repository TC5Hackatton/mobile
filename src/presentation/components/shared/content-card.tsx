import { AccessibilityRole, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface ContentCardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export function ContentCard({
  children,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'none',
}: ContentCardProps) {
  const colors = useThemeColors();
  
  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Card vazio por padrão
  },
});
