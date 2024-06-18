import { User } from "@modules/models/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../root-reducer";

type AuthState = {
  user: null | User;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export const authState = (state: RootState) => state.auth;

export default authSlice.reducer;
