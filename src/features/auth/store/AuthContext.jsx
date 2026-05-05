import { useCallback, useMemo, useState } from 'react';
import { authUtils } from '../../../utils/auth';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => authUtils.getSession());

  const login = useCallback((user) => {
    const authUser = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const nextSession = {
      token: user.token,
      role: user.role,
      user: authUser,
    };

    authUtils.login(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    authUtils.logout();
    setSession({ token: null, role: null, user: null });
  }, []);

  const hasRole = useCallback(
    (allowedRoles = []) => {
      return Boolean(session.role && allowedRoles.includes(session.role));
    },
    [session.role]
  );

  const value = useMemo(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.token),
      login,
      logout,
      hasRole,
    }),
    [session, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
