import React from "react";
import { useState, useEffect } from "react";
import * as auth from "../utils/auth-provider";
import { styled } from "styled-components";
import {BiSolidLike, BiDislike} from 'react-icons/bi'


const CommentForm = ({ editComment, comment, userId }) => {
  const token = auth.getToken();
  const [inEditMode, setInEditMode] = useState(false);
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault;
    setInEditMode(false);
  };

  useEffect(() => {
    if (comment?.likedBy?.includes(userId)) {
      console.log("aici");
      setIsLikedByUser(true);
    }
  }, [comment]);

  const likeComment = async (commentId) => {
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/comment/like/${commentId}`,
        requestOptions
      ).then(() => setIsLikedByUser(true));
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  const dislikeComment = async (commentId) => {
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/comment/dislike/${commentId}`,
        requestOptions
      ).then(() => setIsLikedByUser(false));
    } catch (error) {
      console.error("Failed to dislike comment", error);
    }
  };

  return (
    <>
      {!inEditMode && (
        <div>
          {comment?.user === userId && (
            <button onClick={() => setInEditMode(true)}>Edit comment</button>
          )}
        </div>
      )}
      {inEditMode && comment?.user === userId && (
        <form
          onSubmit={async (e) => {
            handleSubmit(e);
            await editComment(e, comment?._id);
          }}
        >
          <input
            name="description"
            type="text"
            defaultValue={comment?.description}
          />

          <button type="submit">Save</button>
        </form>
      )}

      {isLikedByUser ? (
        <BiDislike onClick={() => dislikeComment(comment?._id)}>
          Dislike comment
        </BiDislike>
      ) : (
        <BiSolidLike onClick={() => likeComment(comment?._id)}>Like comment</BiSolidLike>
      )}
    </>
  );
};

export default CommentForm;
