import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { customColors } from '@/src/presentation/constants/paper-theme';

interface LinkTextProps {
  text: string;
  onPress: () => void;
}

export function LinkText({ text, onPress }: LinkTextProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.link, { color: customColors.skyBlue }]}>{text}</Text>
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
