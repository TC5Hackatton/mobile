import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface LinkTextProps {
  text: string;
  onPress: () => void;
}

export function LinkText({ text, onPress }: LinkTextProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.link, { color: colors.tertiary, fontSize: fontSize.sm }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
});
