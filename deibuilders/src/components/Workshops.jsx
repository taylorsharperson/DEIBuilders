import React, { useState } from "react";

export default function Workshops() {
  // Hard-coded list of workshops
  const [workshops] = useState([
    {
      id: 1,
      title: "Resume & LinkedIn Review",
      date: "Jan 15, 2026",
      time: "5:00 PM",
    },
    {
      id: 2,
      title: "Technical Interview Prep",
      date: "Jan 22, 2026",
      time: "6:30 PM",
    },
    {
      id: 3,
      title: "Networking for DEI Careers",
      date: "Jan 29, 2026",
      time: "7:00 PM",
    },
  ]);

  const [rsvpMessage, setRsvpMessage] = useState("");

  const handleRsvp = (workshopTitle) => {
    // No backend yet – just log it
    console.log(`RSVP submitted for: ${workshopTitle}`);
    setRsvpMessage(`You RSVP'd for: ${workshopTitle}`);
  };

  return (
    <div>
      <h2>Upcoming Workshops</h2>
      <ul>
        {workshops.map((workshop) => (
          <li key={workshop.id}>
            <h3>{workshop.title}</h3>
            <p>
              {workshop.date} at {workshop.time}
            </p>
            <button onClick={() => handleRsvp(workshop.title)}>RSVP</button>
          </li>
        ))}
      </ul>

      {rsvpMessage && <p>{rsvpMessage}</p>}
    </div>
  );
}
