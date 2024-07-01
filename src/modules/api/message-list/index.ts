import baseAxios from '@modules/libs/axios'
import { PaginationResponse, SuccessResponse } from '@modules/libs/axios/types'
import { Message } from '@modules/models/message'

type MessageListResponse = SuccessResponse<PaginationResponse<Message[]>>

export const getMessageList = (params: {
  roomId: string
  perPage?: number
  page: number
}) => {
  return baseAxios.get<MessageListResponse>(`/${params.roomId}/message/list`, {
    params,
  })
}
