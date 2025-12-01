import React, { useState } from 'react';

export default function MentorRequest() {
  const [careerField, setCareerField] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();           // Stop page refresh
    console.log({ careerField, message });  // Log form data
    setSubmitted(true);           // Show confirmation message
  };

  return (
    <div>
      <h2>Mentor Requests</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Career Field:
          <select value={careerField} onChange={(e) => setCareerField(e.target.value)}>
            <option value="">Select a field</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Product Management">Product Management</option>
          </select>
        </label>
        <br />
        <label>
          What are you looking for in a mentor?
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Describe your mentor needs"
          />
        </label>
        <br />
        <button type="submit">Request Mentor</button>
      </form>
      {submitted && <p>Mentor request submitted!</p>}
    </div>
  );
}
