import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";
import Post from "./Post";
import { socket as mySocket } from "../socket";
import Comment from "./Comment";

const Posts = () => {
  const token = auth.getToken();

  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [deletedPostId, setDeletedPostId] = useState(null);

  useEffect(() => {
    setSocket(mySocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      getPosts();
      socket.on("delete-post", (deletedPostId) => {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== deletedPostId)
        );
      });

      socket.on("add-post", (insertedPost) => {
        setPosts((prevPosts) => [...prevPosts, insertedPost]);
      });

      socket.on("edit-post", (updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      });
    }
  }, [socket]);

  const getPosts = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post`,
        requestOptions
      );
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

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
          <div key={post._id}>
            <Post onDeletePost={() => setDeletedPostId(post._id)} post={post} />
            <Comment post={post._id} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
