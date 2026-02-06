import SignUpContent from '@/src/presentation/components/sign-up/smart/SignUpContent';
import { UserProvider } from '@/src/presentation/contexts/UserContext';

export default function SignUp() {
  return (
    <UserProvider>
      <SignUpContent />
    </UserProvider>
  );
}
