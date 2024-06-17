import { Outlet } from "react-router-dom";

function AuthGuard() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default AuthGuard;
