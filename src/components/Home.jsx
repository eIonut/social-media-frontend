import React from "react";
import Chat from "./Chat";
import Posts from "./Posts";
import Navigation from "./Navigation";
import Notifications from "./Notifications";
import Users from "./Users";
const Home = () => {
  return (
    <>
      <Navigation>
        <Notifications />
        {/* <Users /> */}
      </Navigation>
      <Chat />
      <Posts />
    </>
  );
};

export default Home;
