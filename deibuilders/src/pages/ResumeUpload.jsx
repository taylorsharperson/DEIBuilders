import React, { useState } from "react";

// Read API keys from environment (REACT_APP_ prefix is required for Create React App)
// Keys must not be hardcoded. These are read from process.env at build/runtime.
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const JOBMATCH_API_KEY = process.env.REACT_APP_JOBMATCH_API_KEY;

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(false);

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
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      padding: "2.25rem",
      border: "1px solid #eef2f6",
    },
    title: {
      fontSize: "1.4rem",
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
    helper: {
      fontSize: "0.85rem",
      color: "#9ca3af",
      marginTop: "0.25rem",
    },
    input: {
      display: "block",
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
      boxShadow: "0 8px 20px rgba(249,115,22,0.12)",
      transition: "transform 180ms ease, box-shadow 180ms ease",
    },
    muted: {
      color: "#6b7280",
      fontSize: "0.9rem",
    },
    resultCard: {
      marginTop: "1rem",
      padding: "1rem",
      borderRadius: "12px",
      border: "1px solid #eef2f6",
      background: "#fff",
      boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "1rem",
      fontWeight: 700,
      color: "#111",
    },
    successBadge: {
      display: "inline-block",
      padding: "0.25rem 0.5rem",
      background: "rgba(22,163,74,0.12)",
      color: "#16a34a",
      borderRadius: "999px",
      fontSize: "0.85rem",
      fontWeight: 700,
    },
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
    else setFile(null);
    setResult(null);
  setMatches(null);
  setMatchesLoading(false);
  };

  const simulateParse = () => {
    // This simulates a backend / Gemini API call. In a real integration
    // you would send the file to your server or directly to the Gemini API
    // and receive a parsed JSON object. (No real API call here.)

    setLoading(true);
    setResult(null);

    // Fake network/processing time
    setTimeout(() => {
      const mock = {
        name: "Demo Student",
        email: "demo.student@famu.edu",
        skills: ["JavaScript", "React", "AI"],
        education: "B.S. Computer Science — Florida A&M University",
        experience: "2 Internship Matches Found",
      };

      setResult(mock);
      setLoading(false);

      // Start generating job matches (demo) based on parsed skills
      setMatches(null);
      setMatchesLoading(true);

      setTimeout(() => {
        const map = {
          React: "Frontend Developer Intern",
          JavaScript: "Software Engineer Intern",
          AI: "Data Science Intern",
          "Data Structures": "Algorithms Intern",
          Communication: "Technical Communications Intern",
        };

        const seen = new Set();
        const generated = [];

        for (const skill of mock.skills) {
          const key = skill.replace(/\s/g, "");
          const title = map[skill] || map[key] || null;
          if (title && !seen.has(title)) {
            seen.add(title);
            generated.push({ title, company: "Acme Labs", skill });
          }
          if (generated.length >= 3) break;
        }

        // Ensure at least 2 matches
        const fillers = [
          { title: "Software Engineer Intern", company: "Tech Solutions" },
          { title: "Frontend Developer Intern", company: "BrightApps" },
        ];
        let fi = 0;
        while (generated.length < 2 && fi < fillers.length) {
          const f = fillers[fi++];
          if (!generated.find((g) => g.title === f.title)) generated.push({ ...f, skill: "General" });
        }

        setMatches(generated);
        setMatchesLoading(false);
      }, 900);
    }, 1600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    simulateParse();
  };

  return (
    <div style={styles.page}>
      <style>{`
        div[role="main"] { transition: transform 220ms ease, box-shadow 220ms ease; }
        div[role="main"]:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(15,23,42,0.12); }

        .upload-button { transition: transform 180ms ease, box-shadow 180ms ease; }
        .upload-button:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(249,115,22,0.22); }

        @media (prefers-reduced-motion: reduce) { div[role="main"], .upload-button { transition: none !important; transform: none !important; } }
      `}</style>

      <main role="main" style={styles.card} aria-live="polite">
  <h1 style={styles.title}>Resume Upload (AI Powered)</h1>
  <p style={styles.subtitle}>Upload your resume for Gemini AI analysis (Demo)</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.muted} htmlFor="resume-input">
            Select a resume (PDF, DOC)
          </label>
          <input
            id="resume-input"
            aria-label="Resume file"
            style={styles.input}
            type="file"
            accept=".pdf,.doc"
            onChange={handleFileChange}
          />

          <div style={styles.helper}>This demo accepts PDF, DOC, and DOCX files only.</div>

          <button
            type="submit"
            className="upload-button"
            style={{ ...styles.button, opacity: file ? 1 : 0.6, cursor: file ? "pointer" : "not-allowed" }}
            disabled={!file || loading}
          >
            {loading ? "Analyzing…" : "Upload"}
          </button>
        </form>

        <div style={{ marginTop: "0.75rem", color: "#9ca3af", fontSize: "0.875rem" }}>
          This is a demo. No real resume data is stored.
        </div>

        {result && (
          <div style={styles.resultCard} aria-live="polite">
            <h3 style={styles.sectionTitle}>Gemini Parsed Output</h3>
            <div style={{ marginTop: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Name</div>
                  <div style={{ fontWeight: 700 }}>{result.name}</div>
                </div>
                <div style={styles.successBadge}>Demo</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Email</div>
                <div>{result.email}</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Key Skills</div>
                <ul>
                  {result.skills.map((s, i) => (
                    <li key={i} style={{ color: "#374151" }}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Education</div>
                <div>{result.education}</div>
              </div>

              <div style={{ marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Experience Summary</div>
                <div>{result.experience}</div>
              </div>
            </div>
          </div>
        )}
        {/* Generated job matches section (demo) */}
        {result && (
          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.45rem" }}>Generated by Gemini AI (Demo)</div>

            {matchesLoading && (
              <div style={{ ...styles.resultCard, padding: "0.85rem", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#374151" }}>Gemini AI analyzing resume...</div>
              </div>
            )}

            {matches && (
              <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.4rem" }}>
                {matches.map((m, idx) => (
                  <div key={idx} style={styles.resultCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>{m.skill || "Skill"}</div>
                        <div style={{ fontWeight: 700 }}>{m.title}</div>
                        <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem" }}>{m.company}</div>
                      </div>
                      <div style={styles.successBadge}>Match</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
