const envConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    env: import.meta.env.MODE, // Vite automatically sets this to 'development' or 'production'
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
};

export default envConfig;
