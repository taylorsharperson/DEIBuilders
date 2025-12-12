import React, { useState } from "react";

export default function Preferences() {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobType, setJobType] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#4b5563",
    marginBottom: "0.25rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.55rem 0.7rem",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "0.85rem",
    outline: "none",
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
        User Preferences
      </h2>

      <p
        style={{
          margin: 0,
          marginBottom: "0.85rem",
          fontSize: "0.9rem",
          color: "#6b7280",
        }}
      >
        Tailor your job matches based on where and how you want to work.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            placeholder="City, state or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select an industry</option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="health">Healthcare</option>
            <option value="nonprofit">Non-profit / Public Sector</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Job Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select job type</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "0.35rem",
            alignSelf: "flex-start",
            padding: "0.55rem 1.3rem",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "white",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(22,163,74,0.25)",
          }}
        >
          Save preferences
        </button>

        {saved && (
          <div
            style={{
              marginTop: "0.2rem",
              fontSize: "0.8rem",
              color: "#16a34a",
              fontWeight: 500,
            }}
          >
            ✅ Preferences saved!
          </div>
        )}
      </form>
    </section>
  );
}
