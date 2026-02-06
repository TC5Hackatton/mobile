import firebaseConfig from '@/firebaseConfig';
import { AuthRepository, User } from '@/src/domain';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export class FirebaseAuthRepository implements AuthRepository {
  // TODO: decidir se eu vou criar mappers e DTOs, ou se não vai ser necessário (e então remover o "any")
  async signUp(email: string, password: string): Promise<any> {
    const firebaseResponse = await createUserWithEmailAndPassword(firebaseConfig.auth, email, password);
    return firebaseResponse.user;
  }

  async signIn(email: string, password: string): Promise<any> {
    const firebaseResponse = await signInWithEmailAndPassword(firebaseConfig.auth, email, password);
    return firebaseResponse.user;
  }

  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getCurrentUser(): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
