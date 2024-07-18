import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './AuthSlice/AuthSlice'
import notificationReducer from './NotificationSlice/NotificationSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
})

export type RootState = ReturnType<typeof rootReducer>
