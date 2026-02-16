import ForgotPasswordContent from '@/src/presentation/components/forgot-password/smart/ForgotPasswordContent';
import { UserProvider } from '@/src/presentation/contexts/UserContext';

export default function ForgotPassword() {
  return (
    <UserProvider>
      <ForgotPasswordContent />
    </UserProvider>
  );
}
