import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ErrorHandler } from '@/src/infrastructure/error-handler';
import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { CustomTextInput } from '@/src/presentation/components/shared/custom-text-input';
import { LinkText } from '@/src/presentation/components/shared/link-text';
import { LoginLogo } from '@/src/presentation/components/shared/login-logo';
import { useSession } from '@/src/presentation/contexts/SessionContext';
import { useUser } from '@/src/presentation/contexts/UserContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { signInSchema, type SignInFormData } from './sign-in-schema';

export default function SignInContent() {
  const { signInUseCase } = useUser();
  const { setSession } = useSession();
  const colors = useThemeColors();
  const { fontSize } = useFontSize();
  const params = useLocalSearchParams<{ success?: string; message?: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (params.success === 'true' && params.message) {
      Toast.show({
        type: 'success',
        text1: params.message,
      });
    }
  }, [params.success, params.message]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      const session = await signInUseCase.execute(data.email, data.password);
      setSession(session);
      router.replace('/(tabs)/home');
    } catch (error) {
      const appError = ErrorHandler.handle(error, 'SignInContent');
      const friendlyMessage = ErrorHandler.getUserFriendlyMessage(appError);

      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: friendlyMessage,
        position: 'top',
      });
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <LoginLogo />

          <View style={styles.formContainer}>
            <View>
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
                  <Text style={[styles.errorText, { fontSize: fontSize.xs }]}>{errors.email.message}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Senha"
                placeholder="Insira sua senha"
                control={control}
                name="password"
                secureTextEntry
                error={!!errors.password}
                mode="outlined"
                accessibilityLabel="Campo de senha"
                accessibilityHint="Digite sua senha para fazer login"
              />
              {errors.password && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { fontSize: fontSize.xs }]}>{errors.password.message}</Text>
                </View>
              )}
            </View>

            <CustomButton
              label="Entrar"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isSubmitting}
              accessibilityLabel="Botão de entrar"
              accessibilityHint="Faz login na aplicação com as credenciais informadas"
            />

            <CustomButton
              label="Cadastre-se"
              onPress={handleSignUp}
              variant="secondary"
              accessibilityLabel="Botão de cadastrar"
              accessibilityHint="Navega para a tela de cadastro"
            />

            <View style={styles.linkContainer}>
              <LinkText text="Esqueci minha senha" onPress={handleForgotPassword} />
            </View>
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
  inputContainer: {
    marginBottom: 32,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    color: '#E89B8C',
    fontFamily: 'Raleway_400Regular',
  },
  linkContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
});
