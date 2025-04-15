import { server } from './node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import '@testing-library/jest-dom'

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Close server after all tests
afterAll(() => {
  server.close()
})

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
