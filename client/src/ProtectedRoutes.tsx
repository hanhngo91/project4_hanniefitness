import Admin from "./pages/Admin";
import Notfound from "./components/Notfound";
import { useAppSelector } from "./redux/hook";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuth = () => {
  const currentUser = useAppSelector((state: any) => state.auth.currentUser);
  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.roles === 1) {
      navigate("/admin");
      return;
    } else {
      navigate("/notfound");
    }
  }, [currentUser]);
  return currentUser?.roles === 1 ? true : false;
};

function ProtectedRoutes() {
  const isAdmin = useAuth();
  return isAdmin ? <Admin /> : <Notfound />;
}

export default ProtectedRoutes;
