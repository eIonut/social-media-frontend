import React, { useEffect, useState } from "react";
import * as auth from "../utils/auth-provider";
import { socket as mySocket } from "../socket";

const Users = () => {
  const token = auth.getToken();
  const { userId } = auth.getCurrentUser();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(mySocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    getAllUsers();
    getAllFriends();
  }, []);

  useEffect(() => {
    if (socket) {
      getAllUsers();

      socket.on("add-friend", (updatedUserFriends) => {
        console.log(updatedUserFriends);
        // id 123 id 1234 id 12345 - updatedUserFriends
        // id 123 id 1234 - friends
        // const newFriend =
        // setFriends((prevFriends) => updatedUserFriends.find())
        // setFriends((prevFriends) => [...prevFriends, updatedUser]);
        setFriends(updatedUserFriends);
      });
    }
  }, [socket]);

  const getAllUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/me/getAllUsers`,
        requestOptions
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const addFriend = async (id) => {
    if (userId === id) {
      return;
    }
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/me/addFriend/${id}`,
        requestOptions
      );
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

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
      setFriends(data.friends);
    } catch (error) {
      console.error("Failed to get friends:", error);
    }
  };

  return (
    <div>
      {users?.map((user) => (
        <React.Fragment key={user._id}>
          <p>{user.name}</p>
          {friends.some((friend) => friend._id === user._id) ? null : (
            <button onClick={async () => await addFriend(user._id)}>
              Add a friend
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Users;
