import firebaseConfig from '@/firebaseConfig';
import { AuthRepository, Session, User } from '@/src/domain';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

export class FirebaseAuthRepository implements AuthRepository {
  async signUp(email: string, password: string): Promise<User> {
    const firebaseResponse = await createUserWithEmailAndPassword(firebaseConfig.auth, email, password);
    return firebaseResponse.user as any; // TODO: Create proper mapper
  }

  async signIn(email: string, password: string): Promise<Session> {
    const firebaseResponse = await signInWithEmailAndPassword(firebaseConfig.auth, email, password);

    const user = firebaseResponse.user;
    const token = await user.getIdToken();

    return Session.create(user.uid, token);
  }

  async signOut(): Promise<void> {
    await firebaseConfig.auth.signOut();
  }

  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseConfig.auth, email);
  }
}
