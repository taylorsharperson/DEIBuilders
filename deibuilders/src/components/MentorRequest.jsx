import React, { useState } from 'react';

export default function MentorRequest() {
  const [careerField, setCareerField] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ careerField, message });
    setSubmitted(true);
  };

  return (
    <div>
      <h2>Mentor Requests</h2>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Career Field:
            <select
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
            >
              <option value="">Select a field</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Product Management">Product Management</option>
            </select>
          </label>

          <br />

          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the type of mentorship you want..."
            />
          </label>

          <br />

          <button type="submit">Submit Request</button>
        </form>
      ) : (
        <p>Your mentor request has been submitted!</p>
      )}
    </div>
  );
}
