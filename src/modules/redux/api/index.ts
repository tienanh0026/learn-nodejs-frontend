import { COOKIES_EXPIRED_AT } from '@modules/constants/layout'
import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { store } from '../store'
import { clearAuthState } from '../AuthSlice/AuthSlice'
import { SuccessResponse } from '@modules/libs/axios/types'
import { uid } from 'uid'
import { addNotification } from '../NotificationSlice/NotificationSlice'
import Cookies from 'cookies-js'

type RefreshTokenResponse = SuccessResponse<{
  accessToken: string
}>

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get('access-token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error) {
    const id = uid()
    const message = (result.error.data as { message?: string })?.message
    store.dispatch(
      addNotification({
        id,
        title: message,
        type: 'error',
      })
    )
  } else {
    const id = uid()
    const message = (result.data as { message?: string })?.message
    store.dispatch(
      addNotification({
        id,
        title: message,
        type: 'success',
      })
    )
  }
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    if (refreshResult.data) {
      Cookies.set(
        'access-token',
        (refreshResult.data as RefreshTokenResponse).data.accessToken,
        {
          expires: COOKIES_EXPIRED_AT,
        }
      )
      // retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      Cookies.set('access-token', '')
      Cookies.set('refresh-token', '')
      store.dispatch(clearAuthState())
    }
  }
  return result
}

export default baseQueryWithReAuth
