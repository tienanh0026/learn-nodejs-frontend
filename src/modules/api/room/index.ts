import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'
import { Room, RoomDetail, RoomUser } from '@modules/models/room'

type RoomDetailResponse = SuccessResponse<RoomDetail>
type CreateRoomResponse = SuccessResponse<Room>
type GetRoomUserList = SuccessResponse<RoomUser[]>

export const getRoomDetail = (roomId: string) => {
  return baseAxios.get<RoomDetailResponse>(`/room/${roomId}`)
}

export const createRoom = ({ formData }: { formData: FormData }) => {
  return baseAxios.post<CreateRoomResponse>('/room/create', formData, {
    data: formData,
    transformRequest: [(data) => data],
  })
}

export const updateRoom = ({
  formData,
  roomId,
}: {
  formData: FormData
  roomId: string
}) => {
  return baseAxios.post(`/room/${roomId}/edit`, formData, {
    data: formData,
    transformRequest: [(data) => data],
  })
}

export const addRoomUser = ({
  roomId,
  userList,
}: {
  roomId: string
  userList: {
    id: string
    role: string
  }[]
}) => {
  return baseAxios.post(`/room/${roomId}/user/add`, {
    user: userList,
  })
}

export const getRoomUserList = ({ roomId }: { roomId: string }) => {
  return baseAxios.get<GetRoomUserList>(`/room/${roomId}/user/list`)
}
