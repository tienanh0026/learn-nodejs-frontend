import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";
import { User } from "@modules/models/user";

type RegisterResponse = SuccessResponse<{
    accessToken: string;
    user: User;
}>;

export const register = (params: {
    email: string;
    password: string;
    name: string;
}) => {
    return baseAxios.post<RegisterResponse>("/auth/register", params);
};
