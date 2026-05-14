import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  role: null,
  user: null,
};

export const createAuthSession = (user) => ({
  token: user.token,
  role: user.role,
  user: {
    email: user.email,
    name: user.name,
    role: user.role,
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, user } = action.payload;

      state.token = token;
      state.role = role;
      state.user = user;
    },
    logoutSuccess: (state) => {
      state.token = null;
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
