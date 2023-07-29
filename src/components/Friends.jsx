import React from "react";
import * as auth from "../utils/auth-provider";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";

const Friends = ({ handleRefresh }) => {
  const token = auth.getToken();

  const decoded = jwt_decode(token);
  const { id: senderId, email: senderEmail } = decoded;

  const [friends, setFriends] = useState([]);
  const [recipientId, setRecipientId] = useState(null);

  useEffect(() => {
    getAllFriends();
  }, []);

  const getAllFriends = async () => {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/me/getFriends`,
        config
      );
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Failed to get friends:", error);
    }
  };
  return (
    <>
      <h2>Friends {friends.length}</h2>
      {friends?.friends?.map((friend) => (
        <button
          onClick={() => {
            setRecipientId(friend._id);
            handleRefresh();
          }}
          key={friend._id}
        >
          {friend.name}
        </button>
      ))}
    </>
  );
};

export default Friends;
