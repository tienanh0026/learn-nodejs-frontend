import { PaginationResponse, SuccessResponse } from '@modules/libs/axios/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithReAuth from '.'
import { formatQueryParams } from '@modules/funcs/utils'
import { Message } from '@modules/models/message'

type MessageListResponse = SuccessResponse<PaginationResponse<Message[]>>

const messageApi = createApi({
  reducerPath: 'message-api',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMessageList: builder.query<
      MessageListResponse,
      {
        roomId: string
        params: {
          page: number
          perPage?: number
        }
      }
    >({
      query: ({ roomId, params }) => {
        const queryString = formatQueryParams(params)
        return `/${roomId}/message/list${queryString}`
      },
    }),
  }),
})

export const { useGetMessageListQuery } = messageApi

export default messageApi
