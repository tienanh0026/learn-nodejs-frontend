import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './AuthSlice/AuthSlice'
import notificationReducer from './NotificationSlice/NotificationSlice'
import roomApi from './api/room'
import messageApi from './api/message'

export const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
