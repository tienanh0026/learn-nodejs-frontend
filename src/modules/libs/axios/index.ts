import { getRefreshToken } from "@modules/api/refreshToken";
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
    const { config } = error;
    const refreshToken = Cookies.get("refresh-token");
    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }
    try {
        const response = await getRefreshToken(refreshToken);
        Cookies.set("access-token", response.data.data.accessToken);
        if (!config) throw new Error();
        return baseAxios.request(config);
    } catch (refreshTokenError) {
        return Promise.reject(error);
    }
};

baseAxios.interceptors.request.use(authRequestInterceptor);
baseAxios.interceptors.response.use(authResoponseInterceptor, onResponseError);

export default baseAxios;
