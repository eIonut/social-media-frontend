// home, logout, user curent
import React from "react";
import * as auth from "../utils/auth-provider";

const Navigation = ({ children }) => {
  const handleLogout = () => {
    auth.logout();
  };

  return (
    <header>
      <button onClick={handleLogout}>Logout user</button>
      {children}
    </header>
  );
};

export default Navigation;
