import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";

type LoginResponse = SuccessResponse<{
    accessToken: string;
    refreshToken: string;
}>;

export const login = (params: { email: string; password: string }) => {
    return baseAxios.post<LoginResponse>("/auth/login", {
        email: params.email,
        password: params.password,
    });
};
