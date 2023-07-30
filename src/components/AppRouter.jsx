import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import ErrorPage from "./ErrorPage";
import PrivateRoutes from "./PrivateRoutes";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PrivateRoutes />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </Router>
);

export default React.memo(AppRouter);
