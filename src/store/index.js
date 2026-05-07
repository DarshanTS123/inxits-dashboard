import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from '../features/layout/store/layoutSlice';

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
});
