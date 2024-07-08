import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'

type SendMessageResponse = SuccessResponse<null>

export const sendMessage = ({
  roomId,
  formData,
}: {
  roomId: string
  formData: FormData
}) => {
  return baseAxios.post<SendMessageResponse>(`/${roomId}/message`, formData, {
    data: formData,
    transformRequest: [(data) => data],
  })
}
