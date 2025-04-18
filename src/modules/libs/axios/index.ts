import { getRefreshToken } from '@modules/api/refreshToken'
import { COOKIES_EXPIRED_AT } from '@modules/constants/layout'
import { clearAuthState } from '@modules/redux/AuthSlice/AuthSlice'
import { addNotification } from '@modules/redux/NotificationSlice/NotificationSlice'
import { store } from '@modules/redux/store'
import axios from 'axios'
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'cookies-js'
import { uid } from 'uid'

const baseAxios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.method === 'post') {
    config.headers['Content-Type'] = 'application/json'
  }
  if (!config.headers.Authorization) {
    const token = Cookies.get('access-token')
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

function authResoponseInterceptor(response: AxiosResponse) {
  const id = uid()
  store.dispatch(
    addNotification({
      id,
      title: 'Successfully',
      type: 'success',
    })
  )
  return response
}

const onResponseError = async (
  error: AxiosError<{ message: string | undefined; data: unknown }>
) => {
  const id = uid()
  const message = error.response?.data.message
  store.dispatch(
    addNotification({
      id,
      title: message ? message : 'Failed',
      type: 'error',
    })
  )
  const refreshToken = Cookies.get('refresh-token')
  if (error.response?.status !== 401 || !refreshToken) {
    return Promise.reject(error)
  }
  try {
    const response = await getRefreshToken(refreshToken)
    Cookies.set('access-token', response.data.data.accessToken, {
      expires: COOKIES_EXPIRED_AT,
    })
    const initialRequest = error.config
    if (!initialRequest) throw new Error()
    initialRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`
    return axios.request(initialRequest)
  } catch (refreshTokenError) {
    Cookies.set('access-token', '')
    Cookies.set('refresh-token', '')
    store.dispatch(clearAuthState())
    return Promise.reject(error)
  }
}

baseAxios.interceptors.request.use(authRequestInterceptor)
baseAxios.interceptors.response.use(authResoponseInterceptor, onResponseError)

export default baseAxios
