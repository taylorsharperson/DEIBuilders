import React, { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    text: "You RSVP’d for Resume & LinkedIn Review.",
    time: "5 min ago",
  },
  {
    id: 2,
    text: "Your mentor request has been received.",
    time: "1 hour ago",
  },
  {
    id: 3,
    text: "New DEI internship opportunities are available.",
    time: "Yesterday",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [allRead, setAllRead] = useState(false);

  const handleMarkAll = () => {
    setAllRead(true);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Notifications
        </h2>

        <button
          type="button"
          onClick={handleMarkAll}
          style={{
            fontSize: "0.75rem",
            padding: "0.35rem 0.7rem",
            borderRadius: "999px",
            border: "1px solid #e5e7eb",
            backgroundColor: allRead ? "#f3f4f6" : "#ffffff",
            cursor: "pointer",
          }}
        >
          {allRead ? "All caught up" : "Mark all as read"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {notifications.map((n) => (
          <li
            key={n.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "0.6rem 0",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                marginTop: "0.4rem",
                backgroundColor: n.read ? "#d1d5db" : "#22c55e",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#111827",
                  marginBottom: "0.1rem",
                }}
              >
                {n.text}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                }}
              >
                {n.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
