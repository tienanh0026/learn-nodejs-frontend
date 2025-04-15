// src/mocks/handlers.ts
import { CurrentUserResponse } from '@modules/api/currentUser'
import { User } from '@modules/models/user'
import { http, HttpResponse } from 'msw'

export const MOCK_USER: User = {
  id: 'user_123',
  name: 'Jane Doe',
  email: 'jane@example.com',
  createdAt: '',
  updatedAt: '',
}

export const CurrentUserRequestHandlers = [
  http.get(`${import.meta.env.VITE_BASE_URL}/auth/current`, () =>
    HttpResponse.json<CurrentUserResponse>(
      {
        data: MOCK_USER,
        message: 'asdasd',
      },
      { status: 200 }
    )
  ),
]
