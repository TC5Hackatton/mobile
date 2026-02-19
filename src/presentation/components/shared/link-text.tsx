import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { typography } from '@/src/presentation/constants/typography';

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
    // fontSize definido dinamicamente via useFontSize hook
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
});
