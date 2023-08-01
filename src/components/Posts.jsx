import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";
import Post from "./Post";
import { socket as mySocket } from "../socket";
import Comment from "./Comment";
import { styled } from "styled-components";

const PostsContainer = styled.div`
  height: auto;
  width: 600px;
  margin: auto;
`;
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
      content: "multipart/form-data",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
  const { description, image } = event.target.elements;

  const formData = new FormData();
  formData.append('description', description.value);
  formData.append('image', image.files[0]);

  await createPost(formData);
  };

 const createPost = async (data) => {
    const requestOptions = {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
       await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post`,
        requestOptions
      );
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };


  return (
    <>
      <form onSubmit={async (e) => await handleSubmit(e)}>
        <input name="image" type="file" />
        <input name="description" type="text" />
        <button type="submit">Create post</button>
      </form>
      <PostsContainer>
        {posts.map((post) => (
          <div key={post._id}>
            <img src={import.meta.env.VITE_REACT_APP_ABSOLUTE + post.image} alt="" />
            <Post onDeletePost={() => setDeletedPostId(post._id)} post={post} />
            <Comment post={post._id} />
          </div>
        ))}
      </PostsContainer>
    </>
  );
};

export default Posts;
