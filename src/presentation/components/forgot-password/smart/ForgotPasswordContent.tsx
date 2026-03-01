import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './forgot-password-schema';

import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { CustomTextInput } from '@/src/presentation/components/shared/custom-text-input';
import { LoginLogo } from '@/src/presentation/components/shared/login-logo';
import { useUser } from '@/src/presentation/contexts/UserContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';

export default function ForgotPasswordContent() {
  const { forgotPasswordUseCase } = useUser();
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await forgotPasswordUseCase.execute(data.email);

      Toast.show({
        type: 'success',
        text1: 'Link de redefinição de senha enviado!',
        text2: 'Verifique seu e-mail para redefinir sua senha.',
        position: 'top',
      });

      router.back();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: 'Ocorreu um erro ao tentar enviar o e-mail.',
        position: 'top',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              accessibilityHint="Volta para a tela anterior">
              <IconButton icon="chevron-left" iconColor={colors.tertiary} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSize.xl }]}>Esqueceu sua senha?</Text>
          </View>

          <LoginLogo />

          <Text style={[styles.tagline, { color: colors.text, fontSize: fontSize.xl }]}>Utilize esta tela para enviar um link de redefinição de senha.</Text>

          <View style={styles.formContainer}>
            <CustomTextInput
              label="E-mail"
              placeholder="Insira seu e-mail"
              control={control}
              name="email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              mode="outlined"
              accessibilityLabel="Campo de e-mail"
              accessibilityHint="Digite seu endereço de e-mail para fazer login"
            />
            {errors.email && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize.xs }]}>{errors.email.message}</Text>
              </View>
            )}

            <CustomButton
              label="Enviar link de redefinição de senha"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isSubmitting}
              accessibilityLabel="Botão de enviar link de redefinição de senha"
              accessibilityHint="Envia um link de redefinição de senha para o e-mail informado"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingLeft: 4,
  },
  backButton: {
    marginLeft: -12,
    marginRight: 4,
  },
  headerTitle: {
    fontFamily: 'Raleway_600SemiBold',
    marginLeft: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  errorContainer: {
    marginTop: 4,
    marginBottom: 4,
    minHeight: 20,
  },
  errorText: {
    // fontSize definido dinamicamente via useFontSize hook
    fontFamily: 'Raleway_400Regular',
  },
  tagline: {
    // fontSize definido dinamicamente via useFontSize hook
    maxWidth: '95%',
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
    marginTop: 32,
    marginBottom: 40,
  },
});
