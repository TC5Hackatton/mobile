import { Session } from '../entities/Session';
import { User } from '../entities/User';

export interface AuthRepository {
  signUp(email: string, password: string): Promise<User>;
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}
