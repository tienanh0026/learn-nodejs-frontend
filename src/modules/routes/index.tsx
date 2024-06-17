import AuthGuard from "@components/Layout/AuthGuard";
import LoginPage from "@pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path='/' element={<>home123123</>} />
          <Route path='/register' element={<>register</>} />
          <Route path='/login' element={<LoginPage />} />
        </Route>
        <Route path='/' element={<AuthGuard />}>
          <Route path='/room/:roomId' element={<>room</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouterConfig;
