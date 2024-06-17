import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";

type RefreshTokenResponse = SuccessResponse<{
    accessToken: string;
}>;

export const getRefreshToken = (refreshToken: string) => {
    return baseAxios.post<RefreshTokenResponse>("/auth/refresh", {
        refreshToken,
    });
};
