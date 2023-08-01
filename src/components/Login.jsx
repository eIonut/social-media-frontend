import React from "react";
import * as auth from "../utils/auth-provider";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const LoginForm = styled.form`
  max-width: 400px;
  margin: auto;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 40px;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  outline: none;
  border: 1px solid gray;
`;

const Button = styled.button`
  padding: 8px;
  outline: none;
  background-color: purple;
  color: white;
  border-radius: 4px;
  border: none;
  transition: all 0.2s ease-out;
  &:hover {
    transform: translateY(-2px);
    cursor: pointer;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Login = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    auth.login({ email, password }).then(() => window.location.assign("/"));
  };
  return (
    <LoginForm onSubmit={handleLogin}>
      <InputGroup>
        <label htmlFor="email">Email:</label>
        <Input name="email" type="email" />
      </InputGroup>

      <InputGroup>
        <label htmlFor="password">Password:</label>
        <Input name="password" type="password" />
      </InputGroup>

      <Button type="submit">Login</Button>
      <p>
        Need an account? <Link to="/register">Register here</Link>
      </p>
    </LoginForm>
  );
};

export default Login;
