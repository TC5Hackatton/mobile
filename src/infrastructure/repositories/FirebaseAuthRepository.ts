import firebaseConfig from '@/firebaseConfig';
import { AuthRepository, User } from '@/src/domain';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

type PartialUser = Omit<User, 'password' | 'email' | 'displayName'>;

export class FirebaseAuthRepository implements AuthRepository {
  // TODO: as soon as I fix it, then I will remove 'displayName' from here and avoid duplicating the logic
  private currentUser: PartialUser | null = null;

  // TODO: decidir se eu vou criar mappers e DTOs, ou se não vai ser necessário (e então remover o "any")
  async signUp(email: string, password: string): Promise<any> {
    const firebaseResponse = await createUserWithEmailAndPassword(firebaseConfig.auth, email, password);
    this.currentUser = firebaseResponse.user;
    return firebaseResponse.user;
  }

  async signIn(email: string, password: string): Promise<any> {
    const firebaseResponse = await signInWithEmailAndPassword(firebaseConfig.auth, email, password);
    this.currentUser = firebaseResponse.user;
    return firebaseResponse.user;
  }

  async forgotPassword(email: string): Promise<any> {
    await sendPasswordResetEmail(firebaseConfig.auth, email);
  }

  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getCurrentUser(): Promise<User> {
    // TODO: implementar lógica para buscar usuário atual e substituir return
    return { ...this.currentUser, email: 'teste@teste.com', displayName: 'TESTE', password: 'TESTE' };
  }

  // TODO: move to a separate mapper file
  // private sanitizeUser(user: any): Omit<User, 'password' | 'email'> {
  //   return {
  //     displayName: user.displayName,
  //     photoUrl: user.photoURL,
  //     uid: user.uid,
  //   };
  // }
}
