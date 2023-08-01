// o sa poti sa dai like/unlike
// o sa display-uim poza, userul, data, description, nr of likes, si commenturile
import { useEffect, useState } from "react";
import * as auth from "../utils/auth-provider";
const Post = ({ post }) => {
  const token = auth.getToken();
  const { userId } = auth.getCurrentUser();
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  useEffect(() => {
    post.likedBy.map((it) => {
      if (it === userId) {
        setIsLikedByUser(true);
      }
    });
  }, []);

  const likePost = async (postId) => {
    await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/post/like/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => setIsLikedByUser(true));
  };

  const dislikePost = async (postId) => {
    await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/post/dislike/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => setIsLikedByUser(false));
  };

  const deletePost = async (postId) => {
    await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => console.log(res));
  };

  return (
    <div>
      <img src={post.image} alt="" />
      <p>Post: {post.description}</p>
      <p>Post likes: {post.likes}</p>
      {isLikedByUser ? (
        <button onClick={async () => await dislikePost(post._id)}>
          Dislike post
        </button>
      ) : (
        <button onClick={async () => await likePost(post._id)}>
          Like post
        </button>
      )}

      {userId === post.user && (
        <button
          onClick={() => {
            deletePost(post._id);
          }}
        >
          Delete Post
        </button>
      )}
    </div>
  );
};

export default Post;
