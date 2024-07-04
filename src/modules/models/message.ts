import { User } from './user'

type Message = {
  id: string
  ownerId: string
  roomId: string
  content: string
  createdAt: string
  updatedAt: Date
  deletedAt?: Date
  owner: Pick<User, 'id' | 'name' | 'email'>
  media: undefined | string
}

export type { Message }
