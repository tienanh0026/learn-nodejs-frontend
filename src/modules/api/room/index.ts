import baseAxios from '@modules/libs/axios'
import { SuccessResponse } from '@modules/libs/axios/types'
import { RoomDetail } from '@modules/models/room'

type RoomDetailResponse = SuccessResponse<RoomDetail>

export const getRoomDetail = (roomId: string) => {
  return baseAxios.get<RoomDetailResponse>(`/room/${roomId}`)
}

export const createRoom = ({
  name,
  image,
}: {
  name: string
  image?: string
}) => {
  return baseAxios.post('/room/create', {
    name,
    image,
  })
}
