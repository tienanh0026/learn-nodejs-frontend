import { Socket, io } from 'socket.io-client'

export const socket: Socket = io(import.meta.env.VITE_BASE_URL, {
  extraHeaders: {
    auth: import.meta.env.VITE_JWT_SOCKET_SECRET,
  },
})
