import React from "react";
import { socket as mySocket } from "../socket";
import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";
import CommentForm from "./CommentForm";

const Comment = ({ post }) => {
  const token = auth.getToken();
  const { userId } = auth.getCurrentUser();

  const [socket, setSocket] = useState(null);
  const [comments, setComments] = useState([]);
  const [inEditMode, setInEditMode] = useState(false);

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
      getComments();
      socket.on("delete-comment", (deletedCommentId) => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== deletedCommentId)
        );
      });

      socket.on("add-comment", (insertedComment) => {
        if (insertedComment.post === post) {
          setComments((prevComments) => [...prevComments, insertedComment]);
        }
      });

      socket.on("edit-comment", (updatedComment) => {
        console.log(updatedComment);
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          )
        );
      });
    }
  }, [socket]);

  const getComments = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/comment/${post}`,
        requestOptions
      );
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const createComment = async (event) => {
    event.preventDefault();
    const data = {
      description: event.target.elements.description.value,
    };

    await client(`post/comment/${post}`, { data, token });
  };

  const deleteComment = async (commentId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/comment/${commentId}`,
        requestOptions
      );
    } catch (error) {
      console.error("Failed to delete comments", error);
    }
  };

  const editComment = async (event, commentId) => {
    event.preventDefault();
    const data = {
      description: event.target.elements.description.value,
    };

    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/comment/${commentId}`,
        requestOptions
      );
    } catch (error) {
      console.error("Failed to delete comments", error);
    }
  };

  return (
    <>
      {comments.map((comment) => (
        <CommentForm
          comment={comment}
          userId={userId}
          key={comment._id}
          editComment={editComment}
          deleteComment={() => deleteComment(comment._id)}
        ></CommentForm>
      ))}
      <form onSubmit={createComment}>
        <input name="description" type="text" />
        <button type="submit">Send comment</button>
      </form>
    </>
  );
};

export default React.memo(Comment);
