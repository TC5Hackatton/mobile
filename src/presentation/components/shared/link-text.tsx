import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface LinkTextProps {
  text: string;
  onPress: () => void;
}

export function LinkText({ text, onPress }: LinkTextProps) {
  const colors = useThemeColors();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.link, { color: colors.tertiary }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
  },
});
