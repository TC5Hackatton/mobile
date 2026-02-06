import { SignInUserUseCase } from '@/src/domain/usecases/SignInUserUseCase';
import { FirebaseAuthRepository } from '@/src/infrastructure';
import SignInContent from '@/src/presentation/components/sign-in/smart/SignInContent';

export default function SignIn() {
  // TODO: melhorar essa implementação usando Context (vai ficar mais clean)
  const authRepository = new FirebaseAuthRepository();
  const signInUseCase = new SignInUserUseCase(authRepository);

  return <SignInContent signInUseCase={signInUseCase} />;
}
