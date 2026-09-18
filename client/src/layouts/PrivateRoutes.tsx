import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useContext";

export function PrivateRoutes() {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/" />;
}
