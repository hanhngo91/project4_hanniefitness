import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signin from "./Signin";
import Register from "./Register";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { logoutRedux } from "../redux/authSlice";
import { notification } from "antd";
import Reservation from "./Reservation";

const Navbar = (): JSX.Element => {
  const [modal1Open, setModal1Open] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [openReserveModal, setOpenReserveModal] = useState(false); //reserve modal
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const arrayCurrentUserLength = Object.keys(currentUser).length;

  //------------------open reserve modal----------------------------
  const showModalReserve = () => {
    setOpenReserveModal(true);
  };
  const handleCloseReserveModal = (): any => {
    setOpenReserveModal(false);
  };

  let navigate = useNavigate();

  //-----------modal sign in------------------
  const handleOpenSignIn = (): void => {
    setModal1Open(true);
  };

  const handleCloseSignIn = (): void => {
    setModal1Open(false);
  };
  //-----------modal register------------------
  const handleOpenRegister = (): void => {
    setModalRegister(true);
  };

  const handleCloseRegister = (): void => {
    setModalRegister(false);
  };

  useEffect(() => {
    if (currentUser) {
      handleCloseSignIn();
      handleCloseRegister();
    }
  }, [currentUser]);

  //Logout:
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
    <>
      {openReserveModal ? (
        <Reservation handleCloseReserveModal={handleCloseReserveModal} />
      ) : (
        <></>
      )}
      <div className="flex justify-around items-center px-12 shadow-lg py-2 bg-[#FDFFF5] fixed top-0 w-screen font-lora z-10">
        {/* -----------------search------------------- */}
        {/* <div className="input-container">
          <input
            placeholder="Search something..."
            className="input"
            name="text"
            type="text"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon"
          >
            <g strokeWidth={0} id="SVGRepo_bgCarrier" />
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              id="SVGRepo_tracerCarrier"
            />
            <g id="SVGRepo_iconCarrier">
              <rect fill="white" />
              <path
                d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </g>
          </svg>
        </div> */}

        <div className="flex-1">
          <ul className="flex justify-around w-2/3 mx-auto text-lg font-medium">
            <Link to="/">
              <li className="cursor-pointer">Home</li>
            </Link>
            <Link to="/coaches">
              <li className="cursor-pointer">Coaches</li>
            </Link>
            <Link to="/classes">
              <li className="cursor-pointer">Classes</li>
            </Link>
            <Link to="/registration-history">
              <li className="cursor-pointer">Registration history</li>
            </Link>
          </ul>
        </div>
        <div className="basis-[30%] items-center">
          {arrayCurrentUserLength > 0 ? (
            <>
              <div className="flex justify-around items-center">
                <span className="text-lg">
                  Welcome {currentUser?.userName}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-[#C1D0DB] text-gray rounded-lg hover:bg-[#91C8E6] hover:text-white"
                >
                  Logout
                </button>
                <button
                  onClick={showModalReserve}
                  className="px-3 py-1 bg-[#e5d0f1] text-gray rounded-lg hover:bg-[#E1B3F8] hover:text-white"
                >
                  Registrations
                </button>
              </div>
            </>
          ) : (
            <ul className="flex gap-3 justify-end">
              <li className="cursor-pointer">
                <button
                  onClick={handleOpenSignIn}
                  className="px-3 py-1 bg-[#C1D0DB] text-gray rounded-lg hover:bg-[#91C8E6] hover:text-white"
                >
                  Sign in
                </button>
              </li>
              <li className="cursor-pointer">
                <button
                  onClick={handleOpenRegister}
                  className="px-3 py-1 bg-[#EECBFF] text-gray rounded-lg hover:bg-[#E1B3F8] hover:text-white"
                >
                  Become a member
                </button>
              </li>
            </ul>
          )}
        </div>
        {modal1Open ? <Signin handleCloseSignIn={handleCloseSignIn} /> : <></>}
        {modalRegister ? (
          <Register handleCloseRegister={handleCloseRegister} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Navbar;
