import baseAxios from "@modules/libs/axios";

export const login = (params: { email: string; password: string }) => {
  return baseAxios.post("/auth/login", {
    email: params.email,
    password: params.password,
  });
};
