// aici o sa arat posturile toate
//sus de tot o sa fie un form pentru create post
import React from "react";
import * as auth from "../utils/auth-provider";
import { Outlet } from "react-router-dom";
import Chat from "./Chat";
import { useState, useEffect } from "react";

const Home = () => {
  const handleLogout = () => {
    auth.logout();
  };

  const [posts, setPosts] = useState([]);
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzI2ZjIzYzFiYmI5ODBjYjVkYmQ2YiIsImVtYWlsIjoiaW9udXRAZ21haWwuY29tIiwiaWF0IjoxNjkwNDY2Mzc5LCJleHAiOjE2OTMwNTgzNzl9.Y9aG6UpTb-pIebCtKqtT3Sdlfv8KZ0tqqSAy9XKqTts",
    },
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/post`, requestOptions)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  return (
    <>
      <button onClick={handleLogout}>Logout user</button>
      <Chat />
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <img src={post.image} alt="" />
            <p>{post.description}</p>
          </div>
        ))}
      </div>
      ;
    </>
  );
};

export default Home;
