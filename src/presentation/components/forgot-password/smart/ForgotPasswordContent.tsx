import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './forgot-password-schema';

import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { CustomTextInput } from '@/src/presentation/components/shared/custom-text-input';
import { LoginLogo } from '@/src/presentation/components/shared/login-logo';
import { customColors } from '@/src/presentation/constants/paper-theme';

export default function ForgotPasswordContent() {
  const params = useLocalSearchParams<{ success?: string; message?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (params.success === 'true' && params.message) {
      Toast.show({
        type: 'success',
        text1: params.message,
      });
    }
  }, [params.success, params.message]);

  const onSubmit = async (data: { email: string }) => {
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, data.email);

      //Caso o envio de email funcione;
      Toast.show({
        type: 'success',
        text1: 'Link de redefinição de senha enviado!',
        text2: 'Verifique seu e-mail para redefinir sua senha.',
        position: 'top',
      });

      router.back();
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error.code);

      //Caso falhe o envio de email, verificamos o código de erro para mostrar uma mensagem mais amigável ao usuário.
      let errorMessage = 'Ocorreu um erro ao tentar enviar o e-mail.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'O e-mail digitado não está cadastrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      }

      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: errorMessage,
        position: 'top',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: customColors.lightGray }]}
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
              <IconButton icon="chevron-left" iconColor={customColors.skyBlue} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Esqueceu sua senha?</Text>
          </View>

          <LoginLogo />

          <Text style={styles.tagline}>Utilize esta tela para enviar um link de redefinição de senha.</Text>

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
                <Text style={styles.errorText}>{errors.email.message}</Text>
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
    fontSize: 20,
    fontFamily: 'Raleway_600SemiBold',
    color: customColors.skyBlue,
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
    fontSize: 12,
    color: customColors.coral,
    fontFamily: 'Raleway_400Regular',
  },
  tagline: {
    fontSize: 24,
    maxWidth: '95%',
    color: customColors.mediumBlue,
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
    marginTop: 32,
    marginBottom: 40,
  },
});
