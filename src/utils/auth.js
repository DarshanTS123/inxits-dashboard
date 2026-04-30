/**
 * Authentication utilities to manage tokens and roles in localStorage
 */

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

export const authUtils = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  getRole: () => localStorage.getItem(ROLE_KEY),
  
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  
  hasRole: (allowedRoles) => {
    const role = localStorage.getItem(ROLE_KEY);
    return allowedRoles.includes(role);
  },
  
  login: (token, role) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
