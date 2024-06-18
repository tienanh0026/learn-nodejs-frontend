import { getCurrentUser } from "@modules/api/currentUser";
import { socket } from "@modules/libs/socket";
import { authState, setAuthState } from "@modules/redux/AuthSlice/AuthSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(authState);
  const dispatch = useDispatch();
  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        dispatch(
          setAuthState({
            isAuthenticated: true,
            user: response.data.data,
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      socket.connect();
      console.log("connect");
    }
  }, [isLoading, user]);
  return (
    <main className="size-full bg-gray-50 h-svh p-12">
      <div className="border-gray- bg-gray-200 rounded-lg h-full shadow-[rgba(0,0,0,0.24)_0px_3px_8px] p-6">
        {isLoading ? (
          <div className="size-full flex items-center justify-center font-bold">
            Loading...
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </main>
  );
}

export default Layout;
