import baseAxios from "@modules/libs/axios";
import { SuccessResponse } from "@modules/libs/axios/types";
import { Room } from "@modules/models/room";

type RoomListResponse = SuccessResponse<Room[]>;

export const getRoomList = () => {
  return baseAxios.get<RoomListResponse>("/room/list");
};
