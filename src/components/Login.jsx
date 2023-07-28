import React from "react";
import * as auth from "../utils/auth-provider";
const Login = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    auth.login({ email, password }).then(() => window.location.assign("/"));
  };
  return (
    <form onSubmit={handleLogin}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
