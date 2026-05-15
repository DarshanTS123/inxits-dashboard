import { useMutation } from '@tanstack/react-query';
import { publicAuthApi } from '../../../lib/axios';
import { toast } from 'sonner';

/**
 * Hook for user login
 * Uses publicApi as it doesn't require authentication headers
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await publicAuthApi.post('/api/user/login', {
        username: email,
        password,
      });

      const { accessToken, refreshToken, user } = response.result || {};

      if (accessToken && user) {
        const primaryRole = user.roles?.[0]?.toLowerCase();

        toast.success('Login successful! Redirecting...');
        return {
          success: true,
          user: {
            ...user,
            token: accessToken,
            refreshToken,
            role: primaryRole,
            name: user.username || user.email,
          },
        };
      }

      throw new Error(response.message || 'Login failed');
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
