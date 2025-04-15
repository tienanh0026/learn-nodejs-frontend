import { http, HttpResponse } from 'msw'

export const SocketRequestHandlers = [
  http.get(`${import.meta.env.VITE_BASE_URL}/socket.io/`, () => {
    return HttpResponse.json({}, { status: 200 })
  }),
]
