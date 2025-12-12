import React, { useState } from "react";

export default function MentorRequest() {
  const [careerField, setCareerField] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ careerField, message });
    setSubmitted(true);
  };

  return (
    <div className="mentor-form">
      <h2>Request a Mentor</h2>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Career Field
            <select
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
              required
            >
              <option value="">Select a field</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Product Management">Product Management</option>
            </select>
          </label>

          <label>
            What are you looking for in a mentor?
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the type of mentorship you want..."
              required
            />
          </label>

          <button type="submit">Submit Request</button>
        </form>
      ) : (
        <p className="mentor-success">
          Your mentor request has been submitted!
        </p>
      )}
    </div>
  );
}
