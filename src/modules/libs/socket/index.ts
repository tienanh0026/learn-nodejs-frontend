import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  extraHeaders: {
    auth: import.meta.env.VITE_JWT_SOCKET_SECRET,
  },
  autoConnect: false,
});
