// home, logout, user curent
import React from "react";
import * as auth from "../utils/auth-provider";
import { styled } from "styled-components";
import jwt_decode from "jwt-decode";

const Nav = styled.header`
  width: 100%;
  height: 60px;
  background-color: purple;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  padding: 0 20px;
`;

const LogoutContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const LogoutBtn = styled.button`
  padding: 0;
  color: white;
  background-color: transparent;
  border: 1px solid white;
  padding: 6px;
  border-radius: 6px;
`;

const HelloMessage = styled.span`
  color: white;
`;
const Navigation = ({ children }) => {
  const token = auth.getToken();

  const decoded = jwt_decode(token);
  const { email: userEmail } = decoded;
  const handleLogout = () => {
    auth.logout();
  };

  return (
    <Nav>
      {children}
      <LogoutContainer>
        <HelloMessage>Hello, {userEmail}</HelloMessage>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
      </LogoutContainer>
    </Nav>
  );
};

export default Navigation;
