// afiseaza toate notificarile
// filtru dupa isRead true sau false
import React from "react";
import { socket as mySocket } from "../socket";
import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { client } from "../utils/api-client";

const Notifications = () => {
  const token = auth.getToken();
  const { userId } = auth.getCurrentUser();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openNotificationPanel, setOpenNotificationPanel] = useState(false);

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
      getNotifications();

      socket.on("delete-notification", (deletedNotificationId) => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== deletedNotificationId
          )
        );
      });

      socket.on("add-notification", (notification) => {
        if (notification.user === userId)
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
        else return;
      });

      socket.on("read-notification", (updatedNotificationId) => {
        console.log(updatedNotificationId);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === updatedNotificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      });
    }
  }, [socket]);

  const getNotifications = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/notifications/${userId}`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/notifications/${notificationId}`,
        requestOptions
      );
      const data = await response.json();
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const readNotification = async (notificationId) => {
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
        }/notifications/readNotification/${notificationId}`,
        requestOptions
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };
  return (
    <div>
      <button
        onClick={() => setOpenNotificationPanel((prevState) => !prevState)}
      >
        Notifications
      </button>
      {notifications?.map((notification) => (
        <div key={notification?._id}>
          <p>{notification?.message}</p>
          {notification?.isRead ? (
            <button>Unread</button>
          ) : (
            <button onClick={() => readNotification(notification?._id)}>
              Read
            </button>
          )}
          <button onClick={() => deleteNotification(notification?._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
export default Notifications;
