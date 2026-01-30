import firebaseConfig from '@/firebaseConfig';
import { AuthRepository, User } from '@/src/domain';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export class FirebaseAuthRepository implements AuthRepository {
  // TODO: decidir se eu vou criar mappers e DTOs, ou se não vai ser necessário
  async signUp(email: string, password: string): Promise<any> {
    const firebaseResponse = await createUserWithEmailAndPassword(firebaseConfig.auth, email, password);
    return firebaseResponse.user;
  }

  signIn(email: string, password: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getCurrentUser(): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
