import React from "react";
import Chat from "./Chat";
import Posts from "./Posts";
import Navigation from "./Navigation";
import Notifications from "./Notifications";

const Home = () => {
  return (
    <>
      <Navigation>
        <Notifications />
      </Navigation>
      <Chat />
      <Posts />
    </>
  );
};

export default Home;
