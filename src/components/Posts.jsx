import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";
import Post from "./Post";

const Posts = () => {
  const token = auth.getToken();

  const [posts, setPosts] = useState([]);
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/post`, requestOptions)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  const createPost = async (event) => {
    event.preventDefault();
    const currentUser = auth.getCurrentUser();
    const data = {
      description: event.target.elements.description.value,
    };

    await client("post", { data, token }).then((data) => console.log(data));
  };

  return (
    <>
      <form onSubmit={(e) => createPost(e)}>
        <input name="image" type="file" />
        <input name="description" type="text" />
        <button type="submit">Create post</button>
      </form>
      <div>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Posts;
