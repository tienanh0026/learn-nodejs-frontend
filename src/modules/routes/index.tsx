import AuthGuard from '@components/Layout/AuthGuard'
import Layout from '@components/Layout/Layout'
import PublicGuard from '@components/Layout/PublicGuard'
import RoomLayout from '@components/PartsCollection/RoomLayout'
import HomePage from '@pages/home'
import LoginPage from '@pages/login'
import RegisterPage from '@pages/register'
import RoomWrapper from '@pages/room-chat/RoomWrapper'
import RoomListPage from '@pages/room-list'
import RoomSettingPage from '@pages/room-setting'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route>
            <Route path="/" element={<HomePage />} />
            <Route element={<PublicGuard />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Route>
          <Route element={<AuthGuard />}>
            <Route element={<RoomLayout />}>
              <Route path="/room-list" element={<RoomListPage />} />
              <Route path="/room/:roomId" element={<RoomWrapper />} />
              <Route
                path="/room/:roomId/setting"
                element={<RoomSettingPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RouterConfig
