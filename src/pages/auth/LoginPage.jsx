import { LoginForm } from '../../features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <div>
      <h2 className="text-center mb-6 text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
      <p className="text-center text-gray-500 mb-8">
        Please enter your details to sign in.
      </p>
      
      <LoginForm />
    </div>
  );
};
