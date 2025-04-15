import { CurrentUserRequestHandlers } from './apis/CurrentUserRequest.mock'
import { SocketRequestHandlers } from './socket/index.mock'

export const handlers = [
  ...CurrentUserRequestHandlers,
  ...SocketRequestHandlers,
]
