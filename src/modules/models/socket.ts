import { Message } from './message'
import { User } from './user'

type SocketMessage = Message

type TypingStatusMessage = {
  user: User
  isTyping: boolean
  roomId: string
}

export type { SocketMessage, TypingStatusMessage }
