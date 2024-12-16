import baseAxios from '@modules/libs/axios'
import { useApi } from '@modules/libs/axios/hooks'
import { SuccessResponse } from '@modules/libs/axios/types'

type LoginResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
}>

type LoginRequestBody = { email: string; password: string }

export const login = (params: { email: string; password: string }) => {
  return baseAxios.post<LoginResponse>('/auth/login', {
    email: params.email,
    password: params.password,
  })
}

export const useLogin = (params: { email: string; password: string }) => {
  return useApi<LoginResponse, keyof LoginRequestBody>({
    url: '/auth/login',
    data: params,
    method: 'post',
  })
}
