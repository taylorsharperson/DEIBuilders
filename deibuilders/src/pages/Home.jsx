import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <style>{`
        .feature-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
          border-radius: 12px;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.08);
        }

        .top-nav {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(17,24,39,0.04);
        }

        .get-started, .upload-resume {
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .get-started:hover, .upload-resume:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15,23,42,0.12);
        }

        .browse-opportunities {
          transition: transform 200ms ease, color 200ms ease;
        }

        .browse-opportunities:hover {
          transform: translateY(-3px);
          color: #16a34a;
        }
      `}</style>

      <header style={styles.nav} className="top-nav">
        <h2 style={styles.logo}>DEI Builders</h2>

        <div style={styles.navLinks}>
          <span className="nav-link">How It Works</span>
          <span className="nav-link">Features</span>
          <span className="nav-link">Contact</span>
        </div>

        <div style={styles.navButtons}>
          <button
            style={styles.outlineButton}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button style={styles.primaryButton} className="get-started">
            Get Started
          </button>
        </div>
      </header>

      <main style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>
            For college students & underrepresented talent
          </p>

          <h1 style={styles.title}>
            Build your future with{" "}
            <span style={styles.highlight}>clarity</span>, not chaos.
          </h1>

          <p style={styles.subtitle}>
            Upload your resume in any format and let our Gemini-powered AI
            analyze your skills.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.primaryButton}
              className="upload-resume"
              onClick={() => navigate("/resume-upload")}
            >
              Upload Resume
            </button>

            <button
              style={styles.ghostButton}
              className="browse-opportunities"
              onClick={() => navigate("/dashboard")}
            >
              Browse Opportunities
            </button>
          </div>

          <p style={styles.tagline}>
            Built by students, for students. Clean. Ethical. Intelligent.
          </p>
        </div>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Resume Analyzer</h4>
            <p style={styles.featureText}>Gemini-powered resume parsing.</p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Job Matching</h4>
            <p style={styles.featureText}>AI-powered real job matches.</p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Mentorship</h4>
            <p style={styles.featureText}>Request guidance from professionals.</p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Workshops & Events</h4>
            <p style={styles.featureText}>Campus career resources.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fff" },
  nav: { display: "flex", justifyContent: "space-between", padding: "1.5rem" },
  logo: { color: "#16a34a", fontWeight: 700 },
  navLinks: { display: "flex", gap: "1.5rem" },
  navButtons: { display: "flex", gap: "0.75rem" },
  primaryButton: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.25rem",
    borderRadius: "999px",
    cursor: "pointer",
  },
  outlineButton: {
    border: "1px solid #111",
    background: "transparent",
    padding: "0.6rem 1.25rem",
    borderRadius: "999px",
  },
  ghostButton: {
    background: "transparent",
    border: "none",
    color: "#111",
    cursor: "pointer",
  },
  hero: { display: "grid", gridTemplateColumns: "2fr 1fr", padding: "6rem 3rem" },
  heroText: { maxWidth: "650px" },
  eyebrow: { color: "#16a34a" },
  title: { fontSize: "2.6rem" },
  highlight: { color: "#f97316" },
  subtitle: { color: "#4b5563" },
  heroButtons: { display: "flex", gap: "1rem" },
  tagline: { color: "#6b7280" },
  featureGrid: { display: "grid", gap: "1.25rem" },
  featureCard: { padding: "1.25rem" },
  featureTitle: { color: "#16a34a" },
  featureText: { color: "#4b5563" },
};

export default Home;

