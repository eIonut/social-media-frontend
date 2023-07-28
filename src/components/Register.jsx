import React from "react";
import * as auth from "../utils/auth-provider";
const Register = () => {
  const handleRegister = (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;

    auth
      .register({ name, email, password })
      .then(() => window.location.assign("/login"));
  };
  return (
    <form onSubmit={handleRegister}>
      <input name="name" type="text" />
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
