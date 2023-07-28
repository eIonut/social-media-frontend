import React, { useState } from "react";

const Friend = ({
  friends,
  setRecipientId,
  handleSendMessage,
  setMessage,
  message,
}) => {
  const [activeFriend, setActiveFriend] = useState(null);

  const handleFriendClick = (friendId) => {
    if (friendId === activeFriend) {
      setActiveFriend(null);
    } else {
      setActiveFriend(friendId);
      setRecipientId(friendId);
    }
  };

  return (
    <div>
      {friends?.friends?.map((friend) => (
        <div key={friend._id}>
          <button onClick={() => handleFriendClick(friend._id)}>
            {friend.name}
          </button>
          {activeFriend === friend._id && (
            <>
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
