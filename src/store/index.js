import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from '../features/auth/store/authSlice';
import layoutReducer from '../features/layout/store/layoutSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // We can whitelist or blacklist specific reducers here
  whitelist: ['auth', 'layout'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
