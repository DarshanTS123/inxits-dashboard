import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  refreshToken: null,
  role: null,
  user: null,
};

export const createAuthSession = (user) => ({
  token: user.token,
  refreshToken: user.refreshToken,
  role: user.role,
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    roles: user.roles,
    type: user.type,
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, refreshToken, role, user } = action.payload;

      state.token = token;
      state.refreshToken = refreshToken;
      state.role = role;
      state.user = user;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const selectAuthSession = (state) => state.auth;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const selectCurrentUser = (state) => state.auth.user;

export const selectCurrentRole = (state) => state.auth.role;

export default authSlice.reducer;
