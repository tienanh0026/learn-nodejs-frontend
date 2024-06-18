import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/AuthSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
