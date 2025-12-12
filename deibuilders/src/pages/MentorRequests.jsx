import React from "react";
import { useNavigate } from "react-router-dom";
import MentorRequest from "../components/MentorRequest";

export default function MentorRequests() {
  const navigate = useNavigate();

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "4.5rem 2rem",
    },
    container: {
      width: "min(1100px, 98vw)",
      backgroundColor: "#ffffff",
      borderRadius: "26px",
      padding: "3rem",
      boxShadow: "0 30px 80px rgba(15,23,42,0.12)",
      border: "1px solid #eef2f6",
      display: "grid",
      gap: "1.75rem",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "1rem",
      flexWrap: "wrap",
    },
    title: {
      margin: 0,
      fontSize: "2.2rem",
      fontWeight: 800,
    },
    subtitle: {
      margin: 0,
      color: "#6b7280",
      fontSize: "0.95rem",
      maxWidth: "600px",
    },
    backBtn: {
      borderRadius: "999px",
      padding: "0.65rem 1rem",
      fontWeight: 700,
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      cursor: "pointer",
      boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
    },
    card: {
      backgroundColor: "#f9fafb",
      borderRadius: "18px",
      border: "1px solid #e5e7eb",
      padding: "2rem",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        .mentor-form {
          max-width: 640px;
          display: grid;
          gap: 16px;
        }

        .mentor-form h2 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          color: #111827;
        }

        .mentor-form label {
          display: grid;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }

        .mentor-form select,
        .mentor-form textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 0.95rem;
          background: #ffffff;
          box-shadow: 0 10px 22px rgba(15,23,42,0.05);
        }

        .mentor-form textarea {
          min-height: 120px;
          resize: vertical;
        }

        .mentor-form select:focus,
        .mentor-form textarea:focus {
          outline: none;
          border-color: rgba(34,197,94,0.7);
          box-shadow: 0 0 0 4px rgba(34,197,94,0.15);
        }

        .mentor-form button {
          width: fit-content;
          border-radius: 999px;
          padding: 0.85rem 1.25rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          box-shadow: 0 16px 36px rgba(34,197,94,0.22);
        }

        .mentor-form button:hover {
          transform: translateY(-2px);
        }

        .mentor-success {
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.35);
          color: #166534;
          font-weight: 700;
          width: fit-content;
        }
      `}</style>

      <main style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Mentor Requests</h1>
            <p style={styles.subtitle}>
              Submit a request to be matched with a mentor aligned to your goals.
            </p>
          </div>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <section style={styles.card}>
          <MentorRequest />
        </section>
      </main>
    </div>
  );
}

