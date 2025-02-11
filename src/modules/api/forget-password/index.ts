import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'

export const forgetPassword = (params: { email: string }) => {
  return baseAxios.post<SuccessResponse<null>>('/auth/forget-password', {
    email: params.email,
  })
}

export const verifyOtp = (params: { email: string; otp: string }) => {
  return baseAxios.post<
    SuccessResponse<{
      accessToken: string
    }>
  >('/auth/otp/verify', {
    email: params.email,
    otp: params.otp,
  })
}

export const changePassword = (password: string, token: string) => {
  console.log(token)

  return baseAxios.post<SuccessResponse<null>>(
    '/auth/change-password',
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}
