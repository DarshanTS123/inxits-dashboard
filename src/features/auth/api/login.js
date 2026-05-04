import { useMutation } from '@tanstack/react-query';
import { publicApi } from '../../../lib/axios';
import { authUtils } from '../../../utils/auth';
import { toast } from 'sonner';

/**
 * Hook for user login
 * Uses publicApi as it doesn't require authentication headers
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const users = await publicApi.get('/mock/user.json', {
          baseURL: '/',
        });
        
        const user = users.users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          authUtils.login(user.token, user.role);
          toast.success('Login successful! Redirecting...');
          return { success: true, user };
        }

        throw new Error('Invalid email or password');
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      // If it's a manual error (not from axios), show the toast here
      // Real axios errors are handled by the interceptor in axios.js
      if (!error.response) {
        toast.error(error.message || 'Login failed');
      }
    },
  });
};
