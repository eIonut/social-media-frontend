import React from "react";
import Chat from "./Chat";
import Posts from "./Posts";
import Navigation from "./Navigation";

const Home = () => {
  return (
    <>
      <Navigation />
      <Chat />
      <Posts />
    </>
  );
};

export default Home;
