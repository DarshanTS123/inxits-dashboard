import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer, {
  loginSuccess,
  logoutSuccess,
} from '../features/auth/store/authSlice';
import layoutReducer, {
  toggleDesktopSidebarCollapsed,
} from '../features/layout/store/layoutSlice';
import { authUtils } from '../utils/auth';
import { layoutPreferences } from '../utils/layoutPreferences';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: toggleDesktopSidebarCollapsed,
  effect: (_, listenerApi) => {
    const { isDesktopSidebarCollapsed } = listenerApi.getState().layout;

    layoutPreferences.setDesktopSidebarCollapsed(isDesktopSidebarCollapsed);
  },
});

listenerMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: (action) => {
    authUtils.login(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: logoutSuccess,
  effect: () => {
    authUtils.logout();
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
