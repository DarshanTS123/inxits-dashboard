/**
 * Authentication utilities to manage tokens and roles in localStorage
 */

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const USER_KEY = 'user';

const parseStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const authUtils = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getSession: () => ({
    token: localStorage.getItem(TOKEN_KEY),
    role: localStorage.getItem(ROLE_KEY),
    user: parseStoredUser(),
  }),

  login: ({ token, role, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
