import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { customColors } from '@/src/presentation/constants/paper-theme';

const toastConfig = {
  success: ({ text1 }: { text1?: string }) => (
    <View style={styles.successContainer}>
      <Text style={styles.successText}>{text1}</Text>
    </View>
  ),
};

export function CustomToast() {
  return <Toast config={toastConfig} topOffset={60} visibilityTime={5000} />;
}

const styles = StyleSheet.create({
  successContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: customColors.lightGreen,
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  successText: {
    fontSize: 14,
    color: customColors.white,
    fontFamily: 'Raleway_500Medium',
    textAlign: 'center',
  },
});
