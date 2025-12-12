import React, { useState } from "react";

const sampleWorkshops = [
  {
    id: 1,
    title: "Resume & LinkedIn Review",
    date: "Jan 15, 2026",
    time: "5:00 PM EST",
  },
  {
    id: 2,
    title: "Technical Interview Prep",
    date: "Jan 22, 2026",
    time: "6:30 PM EST",
  },
  {
    id: 3,
    title: "Networking for DEI Careers",
    date: "Jan 29, 2026",
    time: "7:00 PM EST",
  },
];

export default function Workshops() {
  const [rsvps, setRsvps] = useState({});

  const handleRsvp = (id) => {
    setRsvps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section>
      <h2
        style={{
          margin: 0,
          marginBottom: "0.75rem",
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
      >
        Upcoming Workshops
      </h2>
      <p
        style={{
          margin: 0,
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#6b7280",
        }}
      >
        Stay on top of events that support your career and DEI journey.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {sampleWorkshops.map((ws) => (
          <div
            key={ws.id}
            style={{
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              padding: "0.9rem 1rem",
              backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "0.75rem",
              boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.98rem",
                  marginBottom: "0.25rem",
                }}
              >
                {ws.title}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                {ws.date} at {ws.time}
              </div>
              {rsvps[ws.id] && (
                <div
                  style={{
                    marginTop: "0.35rem",
                    fontSize: "0.8rem",
                    color: "#16a34a",
                    fontWeight: 500,
                  }}
                >
                  ✅ RSVP confirmed – check your email for details.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleRsvp(ws.id)}
              style={{
                padding: "0.45rem 0.9rem",
                fontSize: "0.8rem",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                backgroundColor: rsvps[ws.id] ? "#ecfdf3" : "#f9fafb",
                color: rsvps[ws.id] ? "#166534" : "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {rsvps[ws.id] ? "RSVP’d" : "RSVP"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
