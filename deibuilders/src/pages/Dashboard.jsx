import React from "react";

export default function Dashboard() {
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111111",
      padding: "4.5rem 2rem",
    },
    container: {
      width: "min(1400px, 98vw)",
      borderRadius: "26px",
      backgroundColor: "#ffffff",
      boxShadow: "0 30px 80px rgba(15,23,42,0.12)",
      padding: "3rem",
      border: "1px solid #eef2f6",
      display: "grid",
      gap: "2rem",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "0.75rem",
    },
    title: {
      margin: 0,
      fontSize: "2.2rem",
      fontWeight: 800,
      color: "#111111",
    },
    subtitle: {
      margin: 0,
      color: "rgba(156,163,175,0.7)",
      fontSize: "0.95rem",
      marginBottom: "0.5rem",
    },
    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "1.5rem",
      marginTop: "1rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "1.5rem",
      minHeight: "140px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 12px 34px rgba(15,23,42,0.06)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      transition: "all 220ms cubic-bezier(.4,0,.2,1)",
    },
    cardTitle: {
      margin: 0,
      color: "#16a34a",
      fontWeight: 700,
      fontSize: "1.1rem",
    },
    cardText: {
      margin: 0,
      color: "#4b5563",
      fontSize: "0.95rem",
    },
    statusPanel: {
      display: "flex",
      gap: "1rem",
      background: "transparent",
      borderRadius: "10px",
      padding: "0",
      border: "none",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      background: "#f9fafb",
      borderRadius: "14px",
      padding: "0.75rem 1rem",
      minWidth: "180px",
    },
    statusLabel: {
      fontSize: "0.8rem",
      color: "#6b7280",
    },
    statusValue: {
      fontSize: "0.95rem",
      color: "#111111",
      fontWeight: 600,
    },
    ctaRow: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: "1rem",
    },
    ctaButton: {
      padding: "0.95rem 1.75rem",
      borderRadius: "16px",
      border: "none",
      background: "linear-gradient(135deg, #f97316, #fb923c)",
      color: "#ffffff",
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 14px 36px rgba(249,115,22,0.18)",
      transition: "transform 180ms ease, box-shadow 180ms ease",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        .dash-card { transition: all 220ms cubic-bezier(.4,0,.2,1); }
        .dash-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(15,23,42,0.18); }

        .cta-button { transition: transform 180ms ease, box-shadow 180ms ease; }
        .cta-button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 36px rgba(249,115,22,0.35); }

        @media (prefers-reduced-motion: reduce) {
          .dash-card, .cta-button { transition: none !important; transform: none !important; }
        }
      `}</style>

      <main role="main" style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Student Dashboard</h1>
          <p style={styles.subtitle}>Your career toolkit powered by DEI Builders</p>
        </header>

        <section aria-label="Quick actions" style={styles.quickGrid}>
          <div className="dash-card" style={styles.card} tabIndex={0} role="button" aria-pressed="false">
            <h3 style={styles.cardTitle}>Resume Analyzer</h3>
            <p style={styles.cardText}>Upload and analyze your resume using AI.</p>
          </div>

          <div className="dash-card" style={styles.card} tabIndex={0} role="button" aria-pressed="false">
            <h3 style={styles.cardTitle}>Job Matches</h3>
            <p style={styles.cardText}>View curated job and internship matches.</p>
          </div>

          <div className="dash-card" style={styles.card} tabIndex={0} role="button" aria-pressed="false">
            <h3 style={styles.cardTitle}>Mentorship</h3>
            <p style={styles.cardText}>Connect with professionals in your field.</p>
          </div>

          <div className="dash-card" style={styles.card} tabIndex={0} role="button" aria-pressed="false">
            <h3 style={styles.cardTitle}>Workshops</h3>
            <p style={styles.cardText}>Explore career events and workshops.</p>
          </div>
        </section>

        <section aria-label="Status panel" style={styles.statusPanel}>
          <div style={styles.statusItem}>
            <div style={styles.statusLabel}>Resume Status</div>
            <div style={styles.statusValue}>Not uploaded</div>
          </div>

          <div style={styles.statusItem}>
            <div style={styles.statusLabel}>Match Status</div>
            <div style={styles.statusValue}>No matches yet</div>
          </div>

          <div style={styles.statusItem}>
            <div style={styles.statusLabel}>Account Type</div>
            <div style={styles.statusValue}>FAMU Student (Demo)</div>
          </div>
        </section>

        <div style={styles.ctaRow}>
          <button className="cta-button" style={styles.ctaButton} aria-label="Upload Resume">Upload Resume</button>
        </div>
      </main>
    </div>
  );
}
