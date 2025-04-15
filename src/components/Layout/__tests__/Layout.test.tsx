import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import Layout from '../Layout'
import { store } from '@modules/redux/store'

vi.mock('@modules/libs/socket', () => {
  return {
    socket: {
      connect: vi.fn(),
      disconnect: vi.fn(),
    },
  }
})

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

function renderWithProviders(isChat: boolean = true) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route element={<Layout isChat={isChat} />}>
            <Route
              index
              element={<div data-testid="child-content">Child</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('Layout', () => {
  it('renders loading initially and then shows content', async () => {
    renderWithProviders(true)

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data fetch and rendering child route
    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument()
    })
    const { socket } = await import('@modules/libs/socket')
    await waitFor(() => {
      expect(socket.connect).toHaveBeenCalled()
    })
  })

  it('renders non-chat layout when isChat is false', async () => {
    renderWithProviders(false)

    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument()
    })
    const { socket } = await import('@modules/libs/socket')
    await waitFor(() => {
      expect(socket.connect).not.toHaveBeenCalled()
    })
  })
})
