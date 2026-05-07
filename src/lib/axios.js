import axios from 'axios';
import { toast } from 'sonner';
import envConfig from '../config/envConfig';
import { authUtils } from '../utils/auth';

const BASE_URL = envConfig.apiBaseUrl || 'http://localhost:3000/api';

/**
 * Public API Instance
 * Used for authentication APIs like login, signup, forgot password.
 * No auth headers attached.
 */
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Private API Instance
 * Used for all protected/internal APIs.
 * Automatically attaches Authorization header.
 */
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token to Private API
privateApi.interceptors.request.use(
  (config) => {
    const token = authUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling for Private API
privateApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const skipToast = error.config?.skipToast;

    // Handle 401 - Unauthorized (Token expired or invalid)
    if (status === 401) {
      authUtils.logout();
      if (!skipToast) toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    // Handle 403 - Forbidden
    else if (status === 403) {
      if (!skipToast) toast.error('Access denied. You do not have permission.');
    }
    // Handle 500 - Server Error
    else if (status >= 500) {
      if (!skipToast) toast.error('Server error. Please try again later.');
    }
    // Handle other errors
    else {
      if (!skipToast) toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Response Interceptor for Public API
publicApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Authentication failed';
    const skipToast = error.config?.skipToast;

    // Global error toast for authentication/public requests
    if (!skipToast) {
      toast.error(message);
    }

    return Promise.reject({ ...error, message });
  }
);
