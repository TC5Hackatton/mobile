import { AccessibilityRole, StyleSheet, View, ViewStyle } from 'react-native';

import { customColors } from '@/src/presentation/constants/paper-theme';

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
  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: customColors.white,
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
