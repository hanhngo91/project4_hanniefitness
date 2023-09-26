import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { logoutRedux } from "../redux/authSlice";
import { notification } from "antd";
import CelebrationIcon from "@mui/icons-material/Celebration";

function AdminNavbar() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const arrayCurrentUserLength = Object.keys(currentUser).length;

  let navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    dispatch(logoutRedux())
      .then(() => {
        navigate("/");
        notification.success({
          message: "Logged out successfully!",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex justify-between px-12 shadow-lg py-2 bg-[#FDFFF5] fixed top-0 w-screen font-lora z-10">
      <div className="flex-1">
        <ul className="flex justify-around w-1/2 mx-auto text-lg font-medium items-center">
          <li className="cursor-pointer font-bold flex justify-around items-center">
            <Link to="/">
              <img className="w-[2.5rem] mr-[1rem]" src="/medias/logo4.png" />
            </Link>
            HANNIE FITNESS ADMIN PAGE
          </li>
        </ul>
      </div>
      <div className="basis-[30%] items-center">
        {arrayCurrentUserLength > 0 ? (
          <>
            <div className="flex justify-center items-center">
              <CelebrationIcon /> &nbsp; &nbsp;
              <span className="text-lg">Hi, {currentUser?.userName}!</span>
              <button
                onClick={handleLogout}
                className="ml-[2rem] px-3 py-1 bg-[#C1D0DB] text-gray rounded-lg hover:bg-[#91C8E6] hover:text-white"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;
