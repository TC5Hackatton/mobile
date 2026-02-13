import { useState } from 'react';
import { Control, Controller, FieldPath } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { typography } from '@/src/presentation/constants/typography';

interface CustomTextInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  mode?: 'flat' | 'outlined';
  // Props para react-hook-form
  name?: string;
  control?: Control<any>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function CustomTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  mode = 'flat',
  name,
  control,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: CustomTextInputProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Se usar com react-hook-form
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name as FieldPath<any>}
        render={({ field: { onChange, onBlur, value: fieldValue }, fieldState }) => {
          const hasError = error || !!fieldState.error;
          const hasValue = !!fieldValue;
          const isPassword = secureTextEntry;
          const actualSecureTextEntry = isPassword && !showPassword;
          // Fonte maior apenas quando senha está oculta e tem valor
          const shouldUseLargeFont = isPassword && hasValue && actualSecureTextEntry;
          

          return (
            <TextInput
              label={label}
              placeholder={placeholder || label}
              value={fieldValue || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              mode={mode}
              secureTextEntry={actualSecureTextEntry}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              error={hasError}
              style={styles.input}
              contentStyle={[
                styles.inputContent,
                shouldUseLargeFont && styles.passwordInputContentHidden,
              ]}
              testID={testID}
              accessibilityLabel={accessibilityLabel || label}
              accessibilityHint={accessibilityHint}
              accessibilityRole="text"
              right={
                isPassword && hasValue ? (
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  />
                ) : hasValue && !secureTextEntry ? (
                  <TextInput.Icon
                    icon="close-circle"
                    onPress={() => onChange('')}
                    accessibilityLabel="Limpar campo"
                  />
                ) : undefined
              }
              theme={{
                colors: {
                  primary: customColors.skyBlue,
                  error: theme.colors.error,
                  onSurface: fieldValue ? customColors.gray : customColors.mediumGray,
                  placeholder: customColors.skyBlue,
                  outline: customColors.skyBlue,
                  onSurfaceVariant: customColors.skyBlue,
                },
              }}
            />
          );
        }}
      />
    );
  }

  // Uso tradicional (sem react-hook-form)
  const hasValue = !!value;
  const isPassword = secureTextEntry;
  const actualSecureTextEntry = isPassword && !showPassword;
  // Fonte maior apenas quando senha está oculta e tem valor
  const shouldUseLargeFont = isPassword && hasValue && actualSecureTextEntry;

  return (
    <TextInput
      label={label}
      placeholder={placeholder || label}
      value={value || ''}
      onChangeText={onChangeText}
      mode={mode}
      secureTextEntry={actualSecureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      error={error}
      style={styles.input}
      contentStyle={[
        styles.inputContent,
        shouldUseLargeFont && styles.passwordInputContentHidden,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="text"
      right={
        isPassword && hasValue ? (
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          />
        ) : hasValue && !secureTextEntry ? (
          <TextInput.Icon
            icon="close-circle"
            onPress={() => onChangeText?.('')}
            accessibilityLabel="Limpar campo"
          />
        ) : undefined
      }
      theme={{
        colors: {
          primary: customColors.skyBlue,
          error: theme.colors.error,
          onSurface: value ? customColors.gray : customColors.mediumGray,
          placeholder: customColors.skyBlue,
          outline: customColors.skyBlue,
          onSurfaceVariant: customColors.skyBlue,
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: customColors.white,
  },
  inputContent: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  passwordInputContentHidden: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xxxl,
    letterSpacing: 2,
    lineHeight: 20,
  },
});
