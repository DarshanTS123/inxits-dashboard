import axios from 'axios';
import { toast } from 'sonner';
import envConfig from '../config/envConfig';
import { logoutSuccess } from '../features/auth/store/authSlice';
import { store } from '../store';

const BASE_URL = envConfig.apiBaseUrl;

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
 * Public Auth API Instance
 * Used for unauthenticated auth endpoints hosted outside the mock API base.
 */
export const publicAuthApi = axios.create({
  baseURL: envConfig.authApiBaseUrl,
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
    const token = store.getState().auth.token;
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
      store.dispatch(logoutSuccess());
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

publicAuthApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Authentication failed';
    const skipToast = error.config?.skipToast;

    if (!skipToast) {
      toast.error(message);
    }

    return Promise.reject({ ...error, message });
  }
);
