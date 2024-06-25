import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";

type PushNotiResponse = SuccessResponse<null>;

export const getPushNoti = (params: {
  roomId: string;
  key: ArrayBuffer;
  endpoint: string;
  subscriptionId: string;
}) => {
  return baseAxios.post<PushNotiResponse>(`/subscribe/room/${params.roomId}`);
};
