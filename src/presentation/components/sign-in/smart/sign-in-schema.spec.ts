import { signInSchema } from './sign-in-schema';

describe('signInSchema', () => {
  describe('valid data', () => {
    it('should pass with valid email and password', () => {
      const result = signInSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with minimum 6-character password', () => {
      const result = signInSchema.safeParse({
        email: 'user@example.com',
        password: '123456',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('should fail when email is empty', () => {
      const result = signInSchema.safeParse({ email: '', password: 'password123' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('E-mail é obrigatório');
      }
    });

    it('should fail when email format is invalid', () => {
      const result = signInSchema.safeParse({ email: 'not-an-email', password: 'password123' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('E-mail inválido');
      }
    });

    it('should fail when email is missing @ symbol', () => {
      const result = signInSchema.safeParse({ email: 'userexample.com', password: 'password123' });

      expect(result.success).toBe(false);
    });

    it('should fail when email is missing domain', () => {
      const result = signInSchema.safeParse({ email: 'user@', password: 'password123' });

      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    it('should fail when password is shorter than 6 characters', () => {
      const result = signInSchema.safeParse({ email: 'user@example.com', password: '12345' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha deve ter no mínimo 6 caracteres');
      }
    });

    it('should fail when password is empty', () => {
      const result = signInSchema.safeParse({ email: 'user@example.com', password: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('type inference', () => {
    it('should infer correct data types', () => {
      const result = signInSchema.safeParse({
        email: 'user@example.com',
        password: 'securePass',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.email).toBe('string');
        expect(typeof result.data.password).toBe('string');
      }
    });
  });
});
