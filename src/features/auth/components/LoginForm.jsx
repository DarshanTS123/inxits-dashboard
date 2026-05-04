import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { authUtils } from '../../../utils/auth';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await authUtils.mockLogin(data.email, data.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordToggle = ({ className }) => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={cn(
        'hover:text-primary transition-colors focus:outline-none flex items-center justify-center',
        className
      )}
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-semibold text-heading tracking-tight">
          Welcome
        </h1>
      </div>

      <form
        className="flex flex-col gap-5 sm:gap-7"
        onSubmit={handleSubmit(onSubmit)}
      >
        {loginError && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <p>{loginError}</p>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="admin@gmail.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <div className="flex flex-col gap-2 sm:gap-3">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="************"
            autoComplete="current-password"
            rightIcon={PasswordToggle}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-paragraph hover:text-primary transition-colors font-medium py-1"
            >
              <span className="text-text-disabled mr-1">Forgot Password?</span>{' '}
              Reset
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};
