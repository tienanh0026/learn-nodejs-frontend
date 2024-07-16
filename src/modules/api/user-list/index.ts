import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'
import { User } from '@modules/models/user'

type SendMessageResponse = SuccessResponse<User[]>

export const getUserList = () => {
  return baseAxios.get<SendMessageResponse>('/users')
}
