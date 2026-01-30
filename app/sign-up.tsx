import { CreateUserUseCase } from '@/src/domain';
import { FirebaseAuthRepository } from '@/src/infrastructure/repositories/FirebaseAuthRepository';
import SignUpContent from '@/src/presentation/components/sign-up/smart/SignUpContent';

export default function SignUp() {
  // TODO: melhorar essa implementação usando Context (vai ficar mais clean)
  const authRepository = new FirebaseAuthRepository();
  const createUserUseCase = new CreateUserUseCase(authRepository);

  return <SignUpContent signUpUseCase={createUserUseCase} />;
}
