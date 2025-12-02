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

        .get-started,
        .upload-resume {
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .get-started:hover,
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

      {/* Hero Section */}
      <main style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>For college students & underrepresented talent</p>

          <h1 style={styles.title}>
            Build your future with <span style={styles.highlight}>clarity</span>, not chaos.
          </h1>

          <p style={styles.subtitle}>
            Upload your resume in any format and let our Gemini-powered AI analyze
            your skills, organize your experience, and match you with jobs,
            internships, mentors, and workshops built for your path.
          </p>

          <div style={styles.heroButtons}>
            <button style={styles.primaryButton} className="upload-resume">
              Upload Resume
            </button>

            <button style={styles.ghostButton} className="browse-opportunities">
              Browse Opportunities
            </button>
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
              Upload any resume format and let Gemini AI clean, organize, and
              format your experience.
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Job Matching</h4>
            <p style={styles.featureText}>
              Get matched with internships and full-time roles that fit your real
              skills — not just keywords.
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card">
            <h4 style={styles.featureTitle}>Mentorship</h4>
            <p style={styles.featureText}>
              Connect with mentors in your field who understand your background
              and goals.
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

/* --- styles object unchanged --- */

export default Home;

