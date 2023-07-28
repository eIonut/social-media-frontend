import React from "react";
import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <>
      <h2>Page not found</h2>
      <Link to="/">Go back</Link>
    </>
  );
};

export default ErrorPage;
