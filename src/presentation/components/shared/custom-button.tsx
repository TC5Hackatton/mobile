import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

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
  const colors = useThemeColors();
  
  const getButtonStyle = () => {
    if (variant === 'primary') {
      return { backgroundColor: colors.lightGreen };
    } else if (variant === 'cancel') {
      return { backgroundColor: colors.coral };
    } else {
      return { backgroundColor: colors.primary };
    }
  };

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[styles.buttonBase, getButtonStyle(), isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.buttonText, { color: colors.white }]}>{label}</Text>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
});
