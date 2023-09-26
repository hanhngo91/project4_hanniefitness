import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Admin from "./pages/Admin";
import Coaches from "./pages/Coaches";
import ProtectedRoutes from "./ProtectedRoutes";
import Notfound from "./components/Notfound";
import RegistrationHistory from "./pages/RegistrationHistory";

function App() {
  const currentLocation = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLocation.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/registration-history" element={<RegistrationHistory />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
