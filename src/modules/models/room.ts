import { User } from './user'

type Room = {
  id: string
  ownerId: string
  name: string
  image?: string
  createdAt: string
  updatedAt: string
  deletedAt: Date
}

type RoomDetail = Room & {
  owner: Pick<User, 'id' | 'email' | 'name'>
}

type RoomUser = {
  id: string
  userId: string
  role: 'admin' | 'user'
  roomId: string
  createdAt: string
  updatedAt: string
  readAt: string | null
  lastReadMessageId: string | null
}

export type { Room, RoomDetail, RoomUser }
