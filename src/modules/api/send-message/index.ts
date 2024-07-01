import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'

type SendMessageResponse = SuccessResponse<null>

export const sendMessage = ({
  content,
  roomId,
}: {
  content: string
  roomId: string
}) => {
  return baseAxios.post<SendMessageResponse>(`/${roomId}/message`, { content })
}
