import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useLogin } from '../api/login';
import { useAuth } from '../store/useAuth';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login: saveAuthSession } = useAuth();

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

  const { mutate: login, isPending: isLoading } = useLogin();

  const onSubmit = (data) => {
    setLoginError('');

    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (result) => {
          if (result.success) {
            saveAuthSession(result.user);
            navigate('/dashboard');
          }
        },
        onError: (error) => {
          setLoginError(error.message || 'Invalid credentials');
        },
      }
    );
  };

  const PasswordToggle = ({ className }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setShowPassword(!showPassword)}
      className={cn(
        'p-0 hover:bg-transparent hover:text-primary focus:outline-none',
        className
      )}
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </Button>
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
          Welcome
        </h1>
      </div>

      <form
        className="flex flex-col gap-5 sm:gap-7"
        onSubmit={handleSubmit(onSubmit)}
      >
        {loginError && (
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-primary/5 px-4 py-3 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="space-y-1">
              <p className="font-medium text-primary">Demo Credentials</p>

              <div className="text-muted-foreground space-y-0.5">
                <p>
                  Email:{' '}
                  <span className="font-medium text-foreground">
                    admin@gmail.com
                  </span>
                </p>
                <p>
                  Password:{' '}
                  <span className="font-medium text-foreground">qwerty</span>
                </p>
              </div>
            </div>
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-0 py-1 text-xs font-medium text-paragraph hover:bg-transparent hover:text-primary"
            >
              <span className="text-text-disabled mr-1">Forgot Password?</span>{' '}
              Reset
            </Button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};
