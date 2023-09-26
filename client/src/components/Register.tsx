import { Modal } from "antd";
import { useState, useEffect } from "react";
import user from "../assets/user.svg";
import { registerRedux, resetStatus } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterProps {
  handleCloseRegister: () => void;
}

interface currentUser {
  userId: string;
  userName: string;
  email: string;
  password: string;
}

const Register = ({ handleCloseRegister }: RegisterProps): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(true);
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const error = useAppSelector((state) => state.auth.error);

  let navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      navigate("/");
    }
  }, [currentUser]);

  const closeModal = (): void => {
    setModalOpen(false);
    handleCloseRegister();
  };

  useEffect(() => {
    dispatch(resetStatus());
  }, []);
  //Get all users:
  const [allUsers, setAllUsers] = useState<currentUser[]>([]);
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800/data/users");
      setAllUsers(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  //Check empty input:
  const validateInput = (): boolean => {
    if (userName === "" || userName === null || userName === undefined) {
      return false;
    } else if (email === "" || email === null || email === undefined) {
      return false;
    } else if (password === "" || password === null || password === undefined) {
      return false;
    }
    return true;
  };

  //Check username's length:
  const checkUsernameLength = (): boolean => {
    if (userName.length < 4 || userName.length > 16) {
      return false;
    }
    return true;
  };

  //Validate email:
  const validateEmail = (): boolean => {
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    return emailPattern.test(String(email).toLowerCase());
  };

  //Validate password:
  const validatePassword = (): boolean => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(String(password));
  };

  //Check password's length:
  const checkPasswordLength = (): boolean => {
    if (password.length < 8 && password.length > 16) {
      return false;
    }
    return true;
  };

  //Check password's match:
  const checkPasswordMatch = (): boolean => {
    if (password !== confirmPassword) {
      return false;
    }
    return true;
  };

  //Check if email has been registered:
  const checkEmailRegistered = (): boolean => {
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].email === email) {
        return false;
      }
    }
    return true;
  };

  //Reset error:
  useEffect(() => {
    if (error) {
      notification.error({
        message: error,
      });
    }

    dispatch(resetStatus());
  }, [error]);

  const dispatch = useAppDispatch();

  //Register:
  const handleRegister = (e: any) => {
    e.preventDefault();

    try {
      if (Object.keys(currentUser).length === 0) {
        if (!validateInput()) {
          notification.error({
            message: "Please fill all fields!",
          });
          return;
        } else if (!checkUsernameLength()) {
          notification.error({
            message: "Username must be between 4 and 16 characters!",
          });
          return;
        } else if (!validateEmail()) {
          notification.error({
            message: "Please enter a valid email!",
          });
          return;
        } else if (!validatePassword()) {
          notification.error({
            message:
              "Password must be at least 8 characters, including letters and numbers!",
          });
          return;
        } else if (!checkPasswordLength()) {
          notification.error({
            message: "Password must be between 8 and 16 characters!",
          });
          return;
        } else if (!checkPasswordMatch()) {
          notification.error({
            message: "Passwords do not match!",
          });
          return;
        } else if (!checkEmailRegistered()) {
          notification.error({
            message: "Email has been registered!",
          });
          return;
        } else {
          dispatch(registerRedux({ userName, email, password }));
          navigate("/");
          notification.success({
            message: "Registered successfully!",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        width={350}
        footer={[]}
      >
        <form action="" className="form_main2">
          <p className="heading2">Register</p>
          <div className="inputContainer2">
            <div className="inputIcon2 w-5 h-5 overflow-hidden flex items-center justify-center">
              <img className="object-cover w-full" src={user} />
            </div>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="inputField2"
              id="username"
              placeholder="Username"
            />
          </div>
          <div className="inputContainer2">
            <svg
              className="inputIcon2"
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              fill="#2e2e2e"
              viewBox="0 0 16 16"
            >
              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
            </svg>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="inputField2"
              id="email"
              placeholder="Email"
            />
          </div>
          <div className="inputContainer2">
            <svg
              className="inputIcon2"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="#2e2e2e"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="inputField2"
              id="password"
              placeholder="Password"
            />
          </div>
          <div className="inputContainer2">
            <svg
              className="inputIcon2"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="#2e2e2e"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="inputField2"
              id="confirm-password"
              placeholder="Confirm password"
            />
          </div>
          <button onClick={handleRegister} id="button2">
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Register;
