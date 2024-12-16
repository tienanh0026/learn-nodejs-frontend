import baseAxios from '@modules/libs/axios'
import { useApi } from '@modules/libs/axios/hooks'
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

export const useSendMessage = (
  roomId: string,
  message: {
    content?: string
    file?: File
  }
) => {
  const requestFormData = new FormData()
  if (message.content) requestFormData.append('content', message.content)
  if (message.file) requestFormData.append('file', message.file)
  return useApi({
    url: `/${roomId}/message`,
    method: 'post',
    data: requestFormData,
    transformRequest: [(data) => data],
  })
}

export const scheduleMessage = ({
  roomId,
  message,
  time,
}: {
  roomId: string
  message: {
    content?: string
    file?: File
  }
  time: Date
}) => {
  const requestFormData = new FormData()
  if (message.content) requestFormData.append('content', message.content)
  if (message.file) requestFormData.append('file', message.file)
  requestFormData.append('scheduleAt', time.toISOString())

  return baseAxios.post<SendMessageResponse>(
    `/${roomId}/message/schedule/create`,
    requestFormData,
    {
      data: requestFormData,
      transformRequest: [(data) => data],
    }
  )
}
