import React, { useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "You RSVP'd for Resume & LinkedIn Review.",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      message: "Your mentor request has been received.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "New DEI internship opportunities are available.",
      time: "Yesterday",
      read: false,
    },
  ]);

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
    setNotifications([]);
  };

  return (
    <div>
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <>
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>
                <p>{n.message}</p>
                <small>{n.time}</small>
              </li>
            ))}
          </ul>

          <button onClick={markAllAsRead}>Mark all as read</button>
        </>
      )}
    </div>
  );
}
