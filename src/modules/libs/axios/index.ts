import { getRefreshToken } from "@modules/api/refreshToken";
import { clearAuthState } from "@modules/redux/AuthSlice/AuthSlice";
import { store } from "@modules/redux/store";
import axios from "axios";
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "cookies-js";
const baseAxios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.method === "post") {
    config.headers["Content-Type"] = "application/json";
    console.log("Request Payload:", config.data);
  }
  const token = Cookies.get("access-token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

function authResoponseInterceptor(response: AxiosResponse) {
  return response;
}

const onResponseError = async (error: AxiosError) => {
  const refreshToken = Cookies.get("refresh-token");
  if (error.response?.status !== 401 || !refreshToken) {
    return Promise.reject(error);
  }
  try {
    const response = await getRefreshToken(refreshToken);
    Cookies.set("access-token", response.data.data.accessToken);
    const initialRequest = error.config;
    if (!initialRequest) throw new Error();
    initialRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
    return axios.request(initialRequest);
  } catch (refreshTokenError) {
    Cookies.set("access-token", "");
    Cookies.set("refresh-token", "");
    store.dispatch(clearAuthState());
    return Promise.reject(error);
  }
};

baseAxios.interceptors.request.use(authRequestInterceptor);
baseAxios.interceptors.response.use(authResoponseInterceptor, onResponseError);

export default baseAxios;
