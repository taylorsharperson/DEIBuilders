import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      {/* Component-scoped styles for feature grid hover/transition and navbar */}
      <style>{`
        .feature-grid { }
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
        /* Navbar subtle separation and link/button hover effects */
        .top-nav {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(17,24,39,0.04);
        }
        .top-nav .nav-link {
          cursor: pointer;
          color: #111111;
          position: relative;
          padding-bottom: 2px;
          transition: color 180ms ease;
        }
        .top-nav .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #16a34a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 180ms ease;
          bottom: -4px;
          opacity: 0.9;
        }
        .top-nav .nav-link:hover {
          color: #16a34a;
        }
        .top-nav .nav-link:hover::after {
          transform: scaleX(1);
        }

        .get-started {
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .get-started:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15,23,42,0.12);
        }
        .upload-resume {
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .upload-resume:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15,23,42,0.12);
        }

        .browse-opportunities {
          transition: transform 200ms ease, color 200ms ease;
        }

        .browse-opportunities:hover {
          transform: translateY(-3px);
          color: #16a34a !important;
        }
      `}</style>
      {/* Top Navigation */}
    <header style={styles.nav} className="top-nav">
        <h2 style={styles.logo}>DEI Builders</h2>

        <div style={styles.navLinks}>
      <span className="nav-link">How It Works</span>
      <span className="nav-link">Features</span>
      <span className="nav-link">Contact</span>
        </div>

          <div style={styles.navButtons}>
        <button style={styles.outlineButton} onClick={() => navigate("/login")}>Log In</button>
        <button style={styles.primaryButton} className="get-started">Get Started</button>
          </div>
      </header>

      {/* Hero Section */}
      <main style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>For college students & underrepresented talent</p>

          <h1 style={styles.title}>
            Build your future with <span style={styles.highlight}>clarity</span>, not chaos.
          </h1>

          <p style={styles.subtitle}>
            Upload your resume in any format and let our Gemini-powered AI analyze your skills,
            organize your experience, and match you with jobs, internships, mentors, and workshops
            built for your path.
          </p>

          <div style={styles.heroButtons}>
            <button style={styles.primaryButton} className="upload-resume">Upload Resume</button>
            <button style={styles.ghostButton} className="browse-opportunities">Browse Opportunities</button>
          </div>

          <p style={styles.tagline}>
            Built by students, for students. Clean. Ethical. Intelligent.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={styles.featureGrid} className="feature-grid">
          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Resume Analyzer</h4>
            <p style={styles.featureText}>
              Upload any resume format and let Gemini AI clean, organize, and format your experience.
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Job Matching</h4>
            <p style={styles.featureText}>
              Get matched with internships and full-time roles that fit your real skills — not just keywords.
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Mentorship</h4>
            <p style={styles.featureText}>
              Connect with mentors in your field who understand your background and goals.
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Workshops & Events</h4>
            <p style={styles.featureText}>
              Discover career workshops and programs happening on your campus.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",   // ✅ WHITE BACKGROUND
    color: "#111111",             // ✅ BLACK TEXT
    fontFamily: "Inter, system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 3rem",
    borderBottom: "1px solid #e5e7eb",

  },
  logo: {
    color: "#16a34a",             // ✅ GREEN
    letterSpacing: "0.15em",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "0.9rem",
    color: "#111111",
  },
  navButtons: {
    display: "flex",
    gap: "0.75rem",
  },
  primaryButton: {
    padding: "0.6rem 1.25rem",
    borderRadius: "999px",
    border: "none",
    background: "#f97316",        // ✅ ORANGE
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    
  },
  outlineButton: {
    padding: "0.6rem 1.25rem",
    borderRadius: "999px",
    border: "1px solid #111111",
    background: "transparent",
    color: "#111111",
    cursor: "pointer",
  },
  ghostButton: {
    padding: "0.6rem 1.25rem",
    borderRadius: "999px",
    border: "none",
    background: "transparent",
  color: "#111111",
    cursor: "pointer",
  },
  hero: {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "3rem",
  /* stronger vertical presence */
  padding: "6rem 3rem",
  /* subtle layered Rattler-trail background (soft orange + green) */
  backgroundColor: "#ffffff",
  backgroundImage: "radial-gradient(50% 40% at 18% 45%, rgba(22,163,74,0.09), rgba(22,163,74,0.00) 70%), linear-gradient(140deg, rgba(249,115,22,0.00) 20%, rgba(249,115,22,0.07) 48%, rgba(249,115,22,0.00) 75%), radial-gradient(45% 35% at 75% 70%, rgba(22,163,74,0.06), rgba(22,163,74,0.00) 72%)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left center, center center, right bottom",

  },
  heroText: {
    maxWidth: "650px",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "0.85rem",
    color: "#16a34a",
  },
  title: {
    fontSize: "2.6rem",
    lineHeight: 1.15,
    margin: "1rem 0",
  },
  highlight: {
    color: "#f97316",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#4b5563",
  },
  heroButtons: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  tagline: {
    marginTop: "1rem",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#f9fafb",   // ✅ LIGHT CARD ON WHITE
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
  },
  cardBadge: {
    backgroundColor: "rgba(22, 163, 74, 0.12)",
    color: "#16a34a",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    display: "inline-block",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  cardTitle: {
    marginTop: "0.75rem",
    marginBottom: "0.75rem",
  },
  cardList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    color: "#111111",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.25rem",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    borderRadius: "12px",
    padding: "1.25rem",
    transition: "transform 180ms ease, box-shadow 180ms ease",

  },
  featureTitle: {
    color: "#16a34a",
    fontWeight: 700,
    fontSize: "1.05rem",
    margin: 0,
  },
  featureText: {
    color: "#4b5563",
    fontSize: "0.95rem",
    marginTop: "0.5rem",
    lineHeight: "1.5",
  },
};

export default Home;
