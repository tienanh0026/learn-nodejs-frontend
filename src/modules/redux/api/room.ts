import { SuccessResponse } from '@modules/libs/axios/types'
import { Room } from '@modules/models/room'
import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithReAuth from '.'

type CreateRoomResponse = SuccessResponse<Room>

const roomApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getRoomDetail: builder.query<CreateRoomResponse, string>({
      query: (roomId) => `/room/${roomId}`,
    }),
  }),
})

export const { useGetRoomDetailQuery } = roomApi

export default roomApi
