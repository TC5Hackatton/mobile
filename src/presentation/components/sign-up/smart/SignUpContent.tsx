import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { ErrorHandler } from '@/src/infrastructure/error-handler';
import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { CustomTextInput } from '@/src/presentation/components/shared/custom-text-input';
import { LoginLogo } from '@/src/presentation/components/shared/login-logo';
import { useUser } from '@/src/presentation/contexts/UserContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { signUpSchema, type SignUpFormData } from './sign-up-schema';

export default function SignUpContent() {
  const { signUpUseCase } = useUser();
  const colors = useThemeColors();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signUpUseCase.execute(data.email, data.password);
      console.log('Response:', response);

      // Navegar para a tela de login com mensagem de sucesso
      // TODO: isso pode ser substituído por redirecionar o usuário para a Home, pois já temos
      // ... o token dele. Além disso, deve ser feito no UseCase.
      router.replace({
        pathname: '/sign-in',
        params: { success: 'true', message: 'Conta criada com sucesso!' },
      });
    } catch (error) {
      const appError = ErrorHandler.handle(error, 'SignUpContent');
      const friendlyMessage = ErrorHandler.getUserFriendlyMessage(appError);
      
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: friendlyMessage,
        position: 'top',
      });
    }
  };

  const handleCancel = () => {
    router.back();
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              accessibilityHint="Volta para a tela anterior">
              <IconButton icon="chevron-left" iconColor={colors.tertiary} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Cadastre-se</Text>
          </View>

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
                accessibilityHint="Digite seu endereço de e-mail para cadastro"
              />
              {errors.email && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.email.message}</Text>
                </View>
              )}
            </View>

            <View>
              <CustomTextInput
                label="Senha"
                placeholder="Insira sua senha"
                control={control}
                secureTextEntry
                name="password"
                error={!!errors.password}
                mode="outlined"
                accessibilityLabel="Campo de senha"
                accessibilityHint="Digite sua senha para cadastro"
              />
              {errors.password && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.password.message}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Repita a senha"
                placeholder="Repita sua senha"
                control={control}
                secureTextEntry
                name="confirmPassword"
                error={!!errors.confirmPassword}
                mode="outlined"
                accessibilityLabel="Campo de confirmação de senha"
                accessibilityHint="Repita sua senha para confirmar"
              />
              {errors.confirmPassword && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword.message}</Text>
                </View>
              )}
            </View>

            <CustomButton
              label="Cadastrar"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isSubmitting}
              accessibilityLabel="Botão de cadastrar"
              accessibilityHint="Cria uma nova conta com os dados informados"
            />

            <CustomButton
              label="Cancelar"
              onPress={handleCancel}
              variant="cancel"
              accessibilityLabel="Botão de cancelar"
              accessibilityHint="Cancela o cadastro e volta para a tela anterior"
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
  scrollContent: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    marginLeft: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  errorContainer: {
    marginTop: 4,
    marginBottom: 4,
    minHeight: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Raleway_400Regular',
  },
});
