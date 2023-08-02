
import { socket as mySocket } from "../socket";
import * as auth from "../utils/auth-provider";
import { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { styled } from "styled-components";

const NotificationBell = styled(IoIosNotifications)`
  color: white;
  font-size: 24px;
  position: relative;
`;

const NotificationContainer = styled.div`
  position: relative;
  display: flex;
  width: fit-content;
  &:hover {
    cursor: pointer;
  }
`;

const NotificationCount = styled.span`
  position: absolute;
  top: 0;
  right: -3px;
  background-color: red;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  font-size: 12px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const NotificationPopup = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 200px;
  background-color: purple;
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
`;

const UnreadMessage = styled.div`color: white; display: flex; justify-content: space-between; align-items: center`
const ReadMessage = styled.p`color: rgba(255,255,255, 0.6)`
const UnreadBubble = styled.div`background-color: blue; height: 8px; width: 8px; border-radius: 50%;`
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

  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  return (
    <div style={{ position: "relative" }}>
      <NotificationContainer

        onClick={() => setOpenNotificationPanel((prevState) => !prevState)}
      >
        <NotificationBell></NotificationBell>
        {unreadNotifications.length > 0 && <NotificationCount>{unreadNotifications.length}</NotificationCount>}
      </NotificationContainer>

      {openNotificationPanel && notifications.length > 0 && (
        <NotificationPopup>
          {notifications?.map((notification) => (
            <div  onClick={() => readNotification(notification?._id)}  style={{ padding: "5px 0" }} key={notification?._id}>
              {!notification?.isRead && <UnreadMessage>
               <p>{notification?.message}</p>
               <UnreadBubble></UnreadBubble>
                </UnreadMessage>}
              {notification?.isRead && <ReadMessage>{notification?.message}</ReadMessage>}

              <button onClick={() => deleteNotification(notification?._id)}>
                Delete
              </button>
              <p>{new Date(notification.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </NotificationPopup>
      )}

      {openNotificationPanel && notifications.length === 0 && (
        <NotificationPopup>
          <p>No notifications</p>
        </NotificationPopup>
      )}
    </div>
  );
};
export default Notifications;
