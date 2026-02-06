import { SignInUserUseCase } from '@/src/domain/usecases/SignInUserUseCase';
import SignInContent from '@/src/presentation/components/sign-in/smart/SignInContent';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';

export default function SignIn() {
  const { authRepository } = useDependencies();
  const signInUseCase = new SignInUserUseCase(authRepository);

  return <SignInContent signInUseCase={signInUseCase} />;
}
