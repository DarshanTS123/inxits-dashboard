const envConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    authApiBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL,
    env: import.meta.env.MODE,
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
};

export default envConfig;
