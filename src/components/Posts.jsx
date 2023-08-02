import * as auth from "../utils/auth-provider";
import { useState, useEffect, useRef } from "react";
import { client } from "../utils/api-client";
import Post from "./Post";
import { socket as mySocket } from "../socket";
import Comment from "./Comment";
import { styled } from "styled-components";
import {BsImageFill} from 'react-icons/bs'

const PostsContainer = styled.div`
  height: auto;
  width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostContainer = styled.div`
width: 100%;
height: 100%;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 6px;
  background-color: rgba(0,0,0,0.8);
  color: white;
`

const DescriptionInput = styled.input`
border-radius: 20px;
width: 100%;
padding: 10px;
border: 1px solid gray;
`


const PostForm = styled.form`
width: 100%;
`

const CreatePostBtn = styled.button`
  padding: 6px;
  border-radius: 6px;
  outline: none;
  background-color: transparent;
  border: 1px solid gray;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
  }
`
const Posts = () => {
  const token = auth.getToken();

  const descriptionRef = useRef(null)
  const imageRef = useRef(null)

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

      descriptionRef.current.value = "";
    imageRef.current.value = null;
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

      <PostsContainer>
         <PostForm style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: '50px', color: 'black'}} onSubmit={async (e) => await handleSubmit(e)}>
        <input  style={{ opacity: 0, position: 'absolute', top: '50px', left: 0, zIndex: 9999}}
 ref={imageRef} name="image" type="file" />
        <BsImageFill style={{position: 'absolute', top: '50px', left: 0, width: '30px', height: '30px'}}></BsImageFill>

        <DescriptionInput placeholder='What are you thinking of?' ref={descriptionRef} name="description" type="text" />
        <CreatePostBtn type="submit">Create post</CreatePostBtn>
      </PostForm>

        {posts.map((post) => (
          <PostContainer key={post._id}>
            <Post onDeletePost={() => setDeletedPostId(post._id)} post={post} />
            <Comment post={post._id} />
          </PostContainer>
        ))}
      </PostsContainer>
    </>
  );
};

export default Posts;
