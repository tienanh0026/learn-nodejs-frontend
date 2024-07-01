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

export type { Room, RoomDetail }
