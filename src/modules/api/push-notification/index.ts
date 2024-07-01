import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'

type PushNotiResponse = SuccessResponse<null>

export const getPushNoti = (params: {
  roomId: string
  key: Record<string, string>
  endpoint: string
}) => {
  return baseAxios.post<PushNotiResponse>(`/subscribe/room/${params.roomId}`, {
    key: params.key,
    endpoint: params.endpoint,
  })
}
