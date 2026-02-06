import { CreateUserUseCase } from '@/src/domain';
import SignUpContent from '@/src/presentation/components/sign-up/smart/SignUpContent';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';

export default function SignUp() {
  const { authRepository } = useDependencies();
  const createUserUseCase = new CreateUserUseCase(authRepository);

  return <SignUpContent signUpUseCase={createUserUseCase} />;
}
