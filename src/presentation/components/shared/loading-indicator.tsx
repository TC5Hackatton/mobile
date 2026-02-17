import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function LoadingIndicator() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
