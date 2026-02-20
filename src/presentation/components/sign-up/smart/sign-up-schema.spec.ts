import { signUpSchema } from './sign-up-schema';

describe('signUpSchema', () => {
  describe('valid data', () => {
    it('should pass with valid email, password, and matching confirmPassword', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with minimum 6-character password', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: '123456',
        confirmPassword: '123456',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('should fail when email format is invalid', () => {
      const result = signUpSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path.includes('email'));
        expect(emailError?.message).toBe('E-mail inválido');
      }
    });

    it('should fail when email is missing @ symbol', () => {
      const result = signUpSchema.safeParse({
        email: 'userexample.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when email has no domain extension', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    it('should fail when password is shorter than 6 characters', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: '12345',
        confirmPassword: '12345',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passError = result.error.issues.find((i) => i.path.includes('password'));
        expect(passError?.message).toBe('Senha deve ter no mínimo 6 caracteres');
      }
    });

    it('should fail when password is empty', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: '',
        confirmPassword: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('confirmPassword validation', () => {
    it('should fail when confirmPassword is empty', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
        expect(confirmError?.message).toBeDefined();
      }
    });

    it('should fail when passwords do not match', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'different-password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
        expect(confirmError?.message).toBe('As senhas não coincidem');
      }
    });

    it('should pass when passwords match exactly', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'MySecurePassword!',
        confirmPassword: 'MySecurePassword!',
      });

      expect(result.success).toBe(true);
    });

    it('should fail when passwords differ by case', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
        expect(confirmError?.message).toBe('As senhas não coincidem');
      }
    });
  });

  describe('type inference', () => {
    it('should infer correct data types', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'securePass',
        confirmPassword: 'securePass',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.email).toBe('string');
        expect(typeof result.data.password).toBe('string');
        expect(typeof result.data.confirmPassword).toBe('string');
      }
    });
  });
});
