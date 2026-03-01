import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-paper';

import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

export function CustomToast() {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  const toastConfig = {
    success: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.lightGreen }]}>
        <Icon source="check-circle" size={20} color={colors.white} />
        <View style={styles.textContainer}>
          {text1 && <Text style={[styles.text, styles.successText, { color: colors.white, fontSize: fontSize.sm }]}>{text1}</Text>}
          {text2 && <Text style={[styles.text, styles.successSubtext, { color: colors.white, fontSize: fontSize.xs }]}>{text2}</Text>}
        </View>
      </View>
    ),
    error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <View style={[styles.container, styles.errorContainer, { backgroundColor: colors.error }]}>
        <Icon source="alert-circle" size={20} color={colors.white} />
        <View style={styles.textContainer}>
          {text1 && <Text style={[styles.text, styles.errorText, { color: colors.white, fontSize: fontSize.sm }]}>{text1}</Text>}
          {text2 && <Text style={[styles.text, styles.errorSubtext, { color: colors.white, fontSize: fontSize.xs }]}>{text2}</Text>}
        </View>
      </View>
    ),
  };

  return <Toast config={toastConfig} topOffset={60} visibilityTime={5000} />;
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successContainer: {
    // Estilo específico para sucesso já está no backgroundColor
  },
  errorContainer: {
    // Estilo específico para erro já está no backgroundColor
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontFamily: 'Raleway_500Medium',
  },
  successText: {
    textAlign: 'left',
  },
  successSubtext: {
    fontFamily: 'Raleway_400Regular',
    marginTop: 2,
    opacity: 0.9,
  },
  errorText: {
    textAlign: 'left',
  },
  errorSubtext: {
    fontFamily: 'Raleway_400Regular',
    marginTop: 2,
    opacity: 0.9,
  },
});
