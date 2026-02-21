import { Session } from '@/src/domain/entities/Session';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  __esModule: true,
  default: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

const { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } = require('firebase/auth');
const firebaseConfig = require('@/firebaseConfig').default;
const { FirebaseAuthRepository } = require('./FirebaseAuthRepository');

describe('FirebaseAuthRepository', () => {
  let repository: any;

  beforeEach(() => {
    repository = new FirebaseAuthRepository();
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call createUserWithEmailAndPassword and return user', async () => {
      const mockUser = { uid: '123', email: 'test@test.com' };
      createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const result = await repository.signUp('test@test.com', 'password');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(firebaseConfig.auth, 'test@test.com', 'password');
      expect(result).toBe(mockUser);
    });
  });

  describe('signIn', () => {
    it('should call signInWithEmailAndPassword and return session', async () => {
      const mockUser = { uid: '123', getIdToken: jest.fn().mockResolvedValue('token') };
      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const result = await repository.signIn('test@test.com', 'password');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseConfig.auth, 'test@test.com', 'password');
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Session);
      expect(result.uid).toBe('123');
      expect(result.token).toBe('token');
    });
  });

  describe('signOut', () => {
    it('should call auth.signOut', async () => {
      await repository.signOut();
      expect(firebaseConfig.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should call sendPasswordResetEmail', async () => {
      await repository.forgotPassword('test@test.com');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(firebaseConfig.auth, 'test@test.com');
    });
  });
});
