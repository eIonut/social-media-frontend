import React from "react";
import { socket as mySocket } from "../socket";
import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";

const Comment = ({ post }) => {
  console.log(post);
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
    console.log(commentId);
    event.preventDefault();
    const data = {
      description: e.target.elements.description.value,
    };
    console.log(data);
    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(data),
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

  return (
    <>
      {comments.map((comment) => (
        <React.Fragment key={comment._id}>
          {!inEditMode && (
            <div>
              <p>{comment.description}</p>
              <button onClick={() => setInEditMode(true)}>Edit comment</button>
            </div>
          )}
          {inEditMode && comment.user === userId && (
            <form onSubmit={(event) => editComment(event, comment._id)}>
              <input
                name="description"
                type="text"
                defaultValue={comment.description}
              />

              <button type="submit" onClick={() => setInEditMode(false)}>
                Save
              </button>
            </form>
          )}
          {comment.user === userId && (
            <button onClick={() => deleteComment(comment._id)}>
              Delete comment
            </button>
          )}
        </React.Fragment>
      ))}
      <form onSubmit={createComment}>
        <input name="description" type="text" />
        <button type="submit">Send comment</button>
      </form>
    </>
  );
};

export default React.memo(Comment);
