import React, { useState } from "react";

export default function Preferences() {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobType, setJobType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh

    // For now, just log the preferences
    console.log("Saved preferences:", {
      location,
      industry,
      jobType,
    });

    setMessage("Preferences saved!");
  };

  return (
    <div>
      <h2>User Preferences</h2>

      <form onSubmit={handleSubmit}>
        {/* Location */}
        <div>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or Remote"
            />
          </label>
        </div>

        {/* Industry */}
        <div>
          <label>
            Industry:
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="">Select an industry</option>
              <option value="Tech">Tech</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Nonprofit">Nonprofit</option>
            </select>
          </label>
        </div>

        {/* Job type */}
        <div>
          <label>
            Job Type:
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Select job type</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </label>
        </div>

        <button type="submit">Save Preferences</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
