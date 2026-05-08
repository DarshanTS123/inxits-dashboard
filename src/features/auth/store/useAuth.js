import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAuthSession,
  loginSuccess,
  logoutSuccess,
  selectAuthSession,
  selectIsAuthenticated,
} from './authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectAuthSession);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const login = useCallback(
    (user) => {
      const nextSession = createAuthSession(user);

      dispatch(loginSuccess(nextSession));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutSuccess());
  }, [dispatch]);

  const hasRole = useCallback(
    (allowedRoles = []) => {
      return Boolean(session.role && allowedRoles.includes(session.role));
    },
    [session.role]
  );

  return useMemo(
    () => ({
      ...session,
      isAuthenticated,
      login,
      logout,
      hasRole,
    }),
    [session, isAuthenticated, login, logout, hasRole]
  );
};
