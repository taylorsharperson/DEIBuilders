import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateFamuEmail = (value) => {
    // firstname<number>.lastname@famu.edu  (e.g. bryce1.alexander@famu.edu)
    const re = /^[a-z]+\d+\.[a-z]+@famu\.edu$/i;
    return re.test(value.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFamuEmail(email)) {
      alert("Please enter a valid FAMU email. Example: bryce1.alexander@famu.edu");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Frontend-only demo success
    alert("Account created (demo). No credentials were stored.");
    // reset form
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  // navigate to dashboard after demo registration
  navigate("/dashboard");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111111",
      padding: "2rem",
    },
    card: {
      width: "min(560px, 94vw)",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 12px 36px rgba(15,23,42,0.08)",
      padding: "2.25rem",
      border: "1px solid #eef2f6",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 700,
      margin: 0,
      color: "#111111",
    },
    subtitle: {
      marginTop: "0.5rem",
      fontSize: "0.95rem",
      color: "#6b7280",
    },
    form: {
      marginTop: "1.5rem",
      display: "grid",
      gap: "0.75rem",
    },
    label: {
      fontSize: "0.85rem",
      color: "#374151",
      marginBottom: "0.25rem",
      display: "block",
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "0.85rem 1rem",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "0.95rem",
      boxSizing: "border-box",
    },
    helper: {
      fontSize: "0.8rem",
      color: "#9ca3af",
      marginTop: "0.25rem",
    },
    button: {
      marginTop: "0.6rem",
      width: "100%",
      padding: "0.85rem 1rem",
      borderRadius: "12px",
      border: "none",
      background: "#f97316",
      color: "#ffffff",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: "1rem",
      boxShadow: "0 10px 30px rgba(249,115,22,0.12)",
    },
    footerText: {
      marginTop: "0.85rem",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "0.9rem",
    },
    accent: {
      color: "#16a34a",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        div[role="main"] {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        div[role="main"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(15,23,42,0.12);
        }

        button[type="submit"] {
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        button[type="submit"]:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(249,115,22,0.18);
        }
      `}</style>
      <div style={styles.card} role="main">
        <h1 style={styles.title}>Create Account (FAMU Students)</h1>
        <p style={styles.subtitle}>This is a frontend-only demo. Use your FAMU student credentials for testing.</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bryce1.alexander@famu.edu"
              style={styles.input}
              aria-describedby="email-help"
            />
            <div id="email-help" style={styles.helper}>Format example: bryce1.alexander@famu.edu</div>
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 chars)"
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <div style={styles.footerText}>
          By using this demo you agree that no real account is created. <span style={styles.accent}>FAMU students only</span>
          <div style={{ marginTop: 8 }}>
            <button style={{ background: 'transparent', border: 'none', color: '#16a34a', cursor: 'pointer' }} onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
