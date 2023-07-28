import React, { useState, useEffect } from "react";
import * as auth from "../utils/auth-provider";

const Friend = ({
  setRecipientId,
  handleSendMessage,
  setMessage,
  message,
  messages,
}) => {
  const [activeFriend, setActiveFriend] = useState(null);
  const [friends, setFriends] = useState([]);

  const handleFriendClick = (friendId) => {
    if (friendId === activeFriend) {
      setActiveFriend(null);
    } else {
      setActiveFriend(friendId);
      setRecipientId(friendId);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, []);

  const getAllFriends = async () => {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`,
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
    <div>
      <h2>Friends {friends.length}</h2>

      {friends?.friends?.map((friend) => (
        <div key={friend._id}>
          <button onClick={() => handleFriendClick(friend._id)}>
            {friend.name}
          </button>
          {activeFriend === friend._id && (
            <>
              <div>
                {messages?.map((messageData, index) => (
                  <div key={index}>
                    <span>{messageData.sender}</span>
                    <span>{messageData.message}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Friend;
