import { Axios, InternalAxiosRequestConfig } from "axios";

const baseAxios = new Axios({
  baseURL: import.meta.env.VITE_BASE_URL,
});

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.method === "post") {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
}

baseAxios.interceptors.request.use(authRequestInterceptor);

export default baseAxios;
