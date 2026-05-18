import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for user login
 * Uses mock json data
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch('/mock/user.json');
      const data = await response.json();
      
      const user = data.users.find(u => u.email === email && u.password === password);

      if (user) {
        toast.success('Login successful! Redirecting...');
        return {
          success: true,
          user: {
            ...user,
          },
        };
      }

      throw new Error('Invalid email or password');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};
