import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";
import { User } from "@modules/models/user";

type CurrentUserResponse = SuccessResponse<User>;

export const getCurrentUser = () => {
    return baseAxios.get<CurrentUserResponse>("/auth/current");
};
