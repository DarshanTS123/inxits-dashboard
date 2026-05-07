import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import layoutReducer from '../features/layout/store/layoutSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
  },
});
