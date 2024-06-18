import { authState, clearAuthState } from "@modules/redux/AuthSlice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HomePage() {
  const { user } = useSelector(authState);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearAuthState());
    Cookies.set("access-token", "");
    Cookies.set("refresh-token", "");
  };
  return (
    <div className="size-full flex flex-col">
      {user ? (
        <>
          <div className="w-full flex justify-end">
            <button
              onClick={handleLogout}
              className="p-2 px-3 rounded-md bg-blue-500 text-white font-medium"
            >
              Logout
            </button>
          </div>
          <p>
            Hi, <span className="font-medium text-orange-400">{user.name}</span>
          </p>
          <div className="h-full flex justify-center items-center mx-8">
            <Link
              to="/room-list"
              className="bg-blue-500 text-white rounded-md p-2 w-full text-center max-w-72"
            >
              Room List
            </Link>
          </div>
        </>
      ) : (
        <>
          <p>
            You're not logging in,&nbsp;
            <Link to={"/login"} className="underline">
              click here
            </Link>
            &nbsp;to log in
          </p>
        </>
      )}
    </div>
  );
}

export default HomePage;
