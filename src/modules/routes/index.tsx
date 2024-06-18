import AuthGuard from "@components/Layout/AuthGuard";
import Layout from "@components/Layout/Layout";
import PublicGuard from "@components/Layout/PublicGuard";
import HomePage from "@pages/home";
import LoginPage from "@pages/login";
import RegisterPage from "@pages/register";
import RoomListPage from "@pages/room-list";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route>
            <Route path='/' element={<HomePage />} />
            <Route element={<PublicGuard />}>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
            </Route>
          </Route>
          <Route element={<AuthGuard />}>
            <Route path='/room-list' element={<RoomListPage />} />
            <Route path='/room/:roomId' element={<>room</>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouterConfig;
