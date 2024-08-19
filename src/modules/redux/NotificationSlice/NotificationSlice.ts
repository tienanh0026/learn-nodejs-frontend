import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../root-reducer'

type NotificationState = {
  notiList: NotiItem[]
}

export type NotiItem = {
  id: string
  title: string | undefined
  type: 'success' | 'error'
}

const initialState: NotificationState = {
  notiList: [],
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotiItem>) => {
      state.notiList.splice(0, 0, action.payload)
    },
    removeNotification: (state, action: PayloadAction<NotiItem['id']>) => {
      state.notiList = state.notiList.filter(
        (item) => item.id !== action.payload
      )
    },
  },
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const notificationState = (state: RootState) => state.notification

export default notificationSlice.reducer
