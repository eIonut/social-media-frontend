import { useEffect, useState } from "react";
import io from "socket.io-client";
import * as auth from "../utils/auth-provider";

import jwt_decode from "jwt-decode";
import Friend from "./Friend";
const Chat = () => {
  const token = auth.getToken();

  const decoded = jwt_decode(token);
  const { id: senderId, email: senderEmail } = decoded;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [recipientId, setRecipientId] = useState(null);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.getToken()}`,
    },
  };

  useEffect(() => {
    const serverUrl = "http://localhost:4000";
    const newSocket = io(serverUrl);

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/chat/chatHistory/${recipientId}`,
        config
      );
      const data = await response.json();
      if (Array.isArray(data.chatHistory)) {
        setMessages(data.chatHistory);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  useEffect(() => {
    if (recipientId && socket) {
      fetchChatHistory();

      socket.on("new-message", (newMessage) => {
        if (newMessage.sender === recipientId) {
          fetchChatHistory();
        }
      });
    }
  }, [recipientId, socket]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!message) return;

    const body = {
      recipient: recipientId,
      sender: senderId,
      message: message,
    };

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`,
      },
      body: JSON.stringify(body),
    };

    try {
      await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/chat/addMessage`,
        config
      );
      fetchChatHistory();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div>
      <Friend
        messages={messages}
        setRecipientId={setRecipientId}
        handleSendMessage={handleSendMessage}
        setMessage={setMessage}
        message={message}
      ></Friend>
    </div>
  );
};

export default Chat;
