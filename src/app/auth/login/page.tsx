import LoginForm from '../../../components/auth/login-form';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error;
  return <LoginForm formError={error} />;
}
