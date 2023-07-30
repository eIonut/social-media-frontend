import { Outlet, Navigate } from "react-router-dom";
import * as auth from "../utils/auth-provider";

const PrivateRoutes = () => {
  return auth.getToken() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
