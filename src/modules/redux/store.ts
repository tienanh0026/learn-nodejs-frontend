import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './root-reducer'
import roomApi from './api/room'
import messageApi from './api/message'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(messageApi.middleware)
      .concat(roomApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
