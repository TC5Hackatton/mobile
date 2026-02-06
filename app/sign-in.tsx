import SignInContent from '@/src/presentation/components/sign-in/smart/SignInContent';
import { UserProvider } from '@/src/presentation/contexts/UserContext';

export default function SignIn() {
  return (
    <UserProvider>
      <SignInContent />
    </UserProvider>
  );
}
