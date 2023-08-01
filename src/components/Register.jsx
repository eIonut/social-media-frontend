import React from "react";
import * as auth from "../utils/auth-provider";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const RegisterForm = styled.form`
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
    <RegisterForm onSubmit={handleRegister}>
      <InputGroup>
        <label htmlFor="name">Name:</label>
        <Input name="name" type="text" />
      </InputGroup>
      <InputGroup>
        <label htmlFor="email">Email:</label>
        <Input name="email" type="email" />
      </InputGroup>

      <InputGroup>
        <label htmlFor="password">Password:</label>
        <Input name="password" type="password" />
      </InputGroup>

      <Button type="submit">Register</Button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </RegisterForm>
  );
};

export default Register;
