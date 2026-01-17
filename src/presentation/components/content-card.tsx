import { StyleSheet, View } from 'react-native';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';

interface ContentCardProps {
  children?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
}

export function ContentCard({
  children,
  testID,
  accessibilityLabel,
  accessibilityRole = 'none',
}: ContentCardProps) {
  return (
    <View
      style={styles.container}
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
