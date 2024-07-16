import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'
import { RoomDetail } from '@modules/models/room'

type RoomDetailResponse = SuccessResponse<RoomDetail>

export const getRoomDetail = (roomId: string) => {
  return baseAxios.get<RoomDetailResponse>(`/room/${roomId}`)
}

export const createRoom = ({ formData }: { formData: FormData }) => {
  return baseAxios.post('/room/create', formData, {
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
