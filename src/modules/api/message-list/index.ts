import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";
import { Message } from "@modules/models/message";

type MessageListResponse = SuccessResponse<Message[]>;

export const getMessageList = (roomId: string) => {
  return baseAxios.get<MessageListResponse>(`/${roomId}/message/list`);
};
