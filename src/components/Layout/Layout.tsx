import {
  ChevronLeftIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { getCurrentUser } from "@modules/api/currentUser";
import { HEADER_HEIGHT } from "@modules/constants/layout";
import { socket } from "@modules/libs/socket";
import {
  authState,
  clearAuthState,
  setAuthState,
} from "@modules/redux/AuthSlice/AuthSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Cookies from "cookies-js";

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
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(clearAuthState());
    Cookies.set("access-token", "");
    Cookies.set("refresh-token", "");
    navigate("/login");
  };
  return (
    <>
      <header
        className="w-full bg-white border-b border-gray-200 flex justify-between"
        style={{
          height: HEADER_HEIGHT,
        }}
      >
        <Link
          to=""
          className="hover:underline p-1 h-full flex items-center  px-3"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ChevronLeftIcon className="size-6" />
        </Link>
        {user && (
          <Link
            className="p-1 h-full flex items-center px-3"
            to={"/login"}
            onClick={handleLogout}
          >
            <ArrowRightEndOnRectangleIcon className="size-6" />
          </Link>
        )}
      </header>
      <main
        className="size-full bg-gray-50 h-svh p-12"
        style={{
          maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
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
    </>
  );
}

export default Layout;
