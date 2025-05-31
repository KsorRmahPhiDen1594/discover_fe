import LoginForm from '@/components/auth/LoginForm';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function LoginPage() {
  return (
    <AuthWrapper requireAuth={false}>
      <LoginForm />
    </AuthWrapper>
  );
}
