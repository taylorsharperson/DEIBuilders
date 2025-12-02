import React, { useEffect, useState } from "react";

// DEMO: ResumeUpload component (offline-only). Uses a mocked parse via setTimeout.
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
      padding: "3.5rem",
      background: "linear-gradient(180deg,#f7f8fb 0%, #f1f4f8 100%)",
    },
    card: {
      width: "min(760px,94vw)",
      padding: "2rem",
      borderRadius: 18,
      boxShadow: "0 12px 40px rgba(12,16,24,0.12)",
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "saturate(120%) blur(8px)",
      WebkitBackdropFilter: "saturate(120%) blur(8px)",
      border: "1px solid rgba(15,23,42,0.04)",
    },
    title: { margin: 0, fontSize: "1.45rem", letterSpacing: "-0.01rem", color: "#0f172a" },
    subtitle: { marginTop: 8, color: "#475569", fontSize: "0.96rem" },
    form: { marginTop: 18, display: "flex", flexDirection: "column", gap: 10 },
    helper: { marginTop: 8, color: "#94a3b8", fontSize: "0.9rem" },
    resultCard: { marginTop: 16, padding: 14, borderRadius: 12, border: "1px solid rgba(14,20,30,0.04)", background: "#fff" },
    successBadge: { padding: "0.35rem 0.7rem", background: "#ecfdf5", color: "#059669", borderRadius: 999, fontWeight: 700 },
    uploadButtonInline: { marginTop: 12, borderRadius: 12, padding: "0.65rem 1rem", fontWeight: 800 },
  };

  const generateMatches = (skills) => {
    const map = { React: "Frontend Developer Intern", JavaScript: "Software Engineer Intern", AI: "Data Science Intern" };
    const out = [];
    for (const s of (skills || [])) {
      out.push({ skill: s, title: map[s] || `${s} Specialist`, company: "Demo Co" });
      if (out.length >= 3) break;
    }
    if (out.length === 0) out.push({ skill: "General", title: "Software Engineer Intern", company: "Demo Co" });
    return out;
  };

  // DEMO simulateParse (no network): setTimeout with fake parsed data
  const simulateParse = () => {
    setLoading(true);
    setResult(null);
    setMatches(null);
    setMatchesLoading(true);

    setTimeout(() => {
      const fake = {
        name: "Alex Doe",
        email: "alex.doe@example.com",
        skills: ["React", "JavaScript", "Communication"],
        education: "B.S. Computer Science, Example University",
        experience: "Internship at ExampleCorp; built React apps and assisted with backend APIs.",
      };

      setResult(fake);
      const generated = generateMatches(fake.skills);
      setMatches(generated);
      setMatchesLoading(false);

      // persist & notify per requirements
      try { localStorage.setItem("resumeUploaded", "true"); localStorage.setItem("matchesAvailable", "true"); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent("deib:resumeUploaded", { detail: { matchesAvailable: true } })); } catch (e) {}

      setLoading(false);
    }, 900);
  };

  const handleSubmit = (e) => { e.preventDefault(); if (!file) return; simulateParse(); };
  const handleFileChange = (e) => setFile(e.target.files?.[0] || null);

  useEffect(() => { try { const uploaded = localStorage.getItem("resumeUploaded"); if (uploaded === "true") { /* noop */ } } catch (e) {} }, []);

  return (
    <div className="resume-page" style={styles.page}>
      <style>{`
        .resume-page { display: flex; align-items: center; justify-content: center; }
        .resume-card { transition: transform 200ms cubic-bezier(.2,.9,.24,1), box-shadow 200ms cubic-bezier(.2,.9,.24,1); will-change: transform; }
        .resume-card:hover { transform: translateY(-6px); box-shadow: 0 26px 60px rgba(12,16,24,0.16); }

        .upload-button { transition: transform 200ms cubic-bezier(.2,.9,.24,1), box-shadow 200ms cubic-bezier(.2,.9,.24,1); }
        .upload-button:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(249,115,22,0.20), 0 0 18px rgba(249,115,22,0.08); }
        .upload-button:active { transform: translateY(-1px); }

        .upload-button.primary { background: linear-gradient(180deg,#fb923c,#fb7a22); color: #fff; border: none; }
        .upload-button.primary:focus { outline: none; box-shadow: 0 6px 24px rgba(251,146,60,0.18); }

        @media (prefers-reduced-motion: reduce) { .resume-card, .upload-button { transition: none !important; transform: none !important; } }
      `}</style>

      <main role="main" className="resume-card" style={styles.card} aria-live="polite">
        <h1 style={styles.title}>Resume Upload (Demo)</h1>
        <p style={styles.subtitle}>Upload a resume — demo mode (offline)</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={{ color: "#6b7280" }} htmlFor="resume-input">Select a resume (PDF, DOC, DOCX)</label>
          <input id="resume-input" aria-label="Resume file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          <div style={styles.helper}>This demo accepts PDF, DOC, and DOCX files only.</div>

          <button
            type="submit"
            className="upload-button primary"
            style={{ ...styles.successBadge, ...styles.uploadButtonInline }}
            disabled={!file || loading}
          >
            {loading ? "Analyzing…" : "Upload"}
          </button>
        </form>

        {result && (
          <div style={styles.resultCard}>
            <h3>Parsed</h3>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {matchesLoading && <div style={{ marginTop: 12 }}>Analyzing matches…</div>}
        {matches && (
          <div style={{ marginTop: 12 }}>
            <h3>Matches</h3>
            <ul>
              {matches.map((m, i) => <li key={i}>{m.title} — {m.company} ({m.skill})</li>)}
            </ul>
          </div>
        )}

      </main>
    </div>
  );
}
