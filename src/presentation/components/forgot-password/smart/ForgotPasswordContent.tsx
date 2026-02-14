import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { CustomTextInput } from '@/src/presentation/components/shared/custom-text-input';
import { LoginLogo } from '@/src/presentation/components/shared/login-logo';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordContent() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    console.log('Email para recuperação de senha:', data.email);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: customColors.lightGray }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <LoginLogo />
          <Text style={styles.tagline}>Utilize esta tela para enviar um link {'\n'}de redefinição de senha.</Text>

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
    fontSize: 12,
    color: customColors.coral,
    fontFamily: 'Raleway_400Regular',
  },
  tagline: {
    fontSize: 24,
    color: customColors.mediumBlue,
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
    marginTop: 16,
    marginBottom: 40,
  },
});
