import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

export default function OldestEmptyCard() {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  return (
    <View style={[styles.innerCard, { backgroundColor: colors.surfaceVariant }]}>
      <Text
        variant="titleMedium"
        style={{ color: colors.text, fontSize: fontSize.md }}
        theme={{ colors: { onSurface: colors.text } }}>
        Nenhuma tarefa encontrada
      </Text>
      <Text
        variant="bodySmall"
        style={{ color: colors.text, fontSize: fontSize.sm }}
        theme={{ colors: { onSurface: colors.text } }}>
        Cadastre suas tarefas e comece a usar o app!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  innerCard: {
    borderRadius: 12,
    padding: spacing.md,
  },
});
