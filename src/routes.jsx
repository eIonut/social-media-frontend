import { createBrowserRouter } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Register from "./components/Register";
import ErrorPage from "./components/ErrorPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage></ErrorPage>,
  },
  { path: "/login", element: <Login></Login> },
  { path: "/register", element: <Register></Register> },
]);

export default router;
