import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'cancel';
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function CustomButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: CustomButtonProps) {
  const buttonStyle =
    variant === 'primary'
      ? styles.primaryButton
      : variant === 'cancel'
        ? styles.cancelButton
        : styles.secondaryButton;
  const textStyle = styles.buttonText;

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[styles.buttonBase, buttonStyle, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator color={customColors.white} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo base compartilhado por todos os botões
  buttonBase: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Variantes - apenas cores e características específicas
  primaryButton: {
    backgroundColor: customColors.lightGreen,
  },
  secondaryButton: {
    backgroundColor: customColors.mediumBlue,
  },
  cancelButton: {
    backgroundColor: customColors.coral,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: customColors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
});
