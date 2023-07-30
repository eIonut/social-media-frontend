import { createBrowserRouter } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ErrorPage from "./components/ErrorPage";
import PrivateRoutes from "./components/PrivateRoutes";
const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
    ],
  },
  { path: "/login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
  { path: "*", element: <ErrorPage></ErrorPage> },
]);

export default router;
