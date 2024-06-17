import { User } from "@modules/models/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

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
            state = action.payload;
        },
    },
});

export const { setAuthState } = authSlice.actions;

export const AuthState = (state: RootState) => state.counter.value;

export default authSlice.reducer;
