import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResumeUpload() {
  // State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const navigate = useNavigate();

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#111111',
      padding: '2rem',
    },
    card: {
      width: 'min(560px, 94vw)',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
      padding: '2.25rem',
      border: '1px solid #eef2f6',
    },
    title: {
      fontSize: '1.4rem',
      fontWeight: 700,
      margin: 0,
      color: '#111111',
    },
    subtitle: {
      marginTop: '0.5rem',
      fontSize: '0.95rem',
      color: '#6b7280',
    },
    form: {
      marginTop: '1.5rem',
      display: 'grid',
      gap: '0.75rem',
    },
    helper: {
      fontSize: '0.85rem',
      color: '#9ca3af',
      marginTop: '0.25rem',
    },
    input: {
      display: 'block',
    },
    button: {
      marginTop: '0.6rem',
      width: '100%',
      padding: '0.85rem 1rem',
      borderRadius: '12px',
      border: 'none',
      background: '#f97316',
      color: '#ffffff',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '1rem',
      boxShadow: '0 8px 20px rgba(249,115,22,0.12)',
      transition: 'transform 180ms ease, box-shadow 180ms ease',
    },
    muted: {
      color: '#6b7280',
      fontSize: '0.9rem',
    },
    resultCard: {
      marginTop: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      border: '1px solid #eef2f6',
      background: '#fff',
      boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
    },
    sectionTitle: {
      margin: 0,
      fontSize: '1rem',
      fontWeight: 700,
      color: '#111',
    },
    successBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      background: 'rgba(22,163,74,0.12)',
      color: '#16a34a',
      borderRadius: '999px',
      fontSize: '0.85rem',
      fontWeight: 700,
    },
  };

  // Handle file selection: set file and clear previous outputs
  const handleFileChange = (e) => {
    const f = e && e.target && e.target.files ? e.target.files[0] : null;
    setFile(f || null);
    setResult(null);
    setError(null);
    setMatches([]);
    setMatchesLoading(false);
    // Intentional lightweight log for debugging; not required
    // console.log('FILE_SELECTED', f && f.name);
  };

  // Submit handler: prevent default and run the demo pipeline only when a file is selected
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    await processUpload(file);
  };

  // Deterministic demo pipeline: always sets result and matches, never throws
  const processUpload = async (maybeFile) => {
    setLoading(true);
    setMatchesLoading(true);
    setError(null);
    setResult(null);
    setMatches([]);

    try {
      const filename = (maybeFile && maybeFile.name) ? maybeFile.name : 'Demo Student Resume.txt';
      const basename = filename.replace(/\.[^.]+$/, '');

      // Infer a friendly name from the filename when possible
      const nameParts = basename.match(/[A-Z][a-z]+/g);
      const inferredName = (nameParts && nameParts.length) ? nameParts.slice(0, 2).join(' ') : 'Demo Student';

      // Deterministic delay between 1200 and 1600 ms
      const delay = 1200 + (basename.length % 401);
      await new Promise((res) => setTimeout(res, Math.max(1200, Math.min(1600, delay))));

      // Structured deterministic result required by spec
      const demoResult = {
        name: 'Demo Student',
        email: 'student@famu.edu',
        phone: '(561) 555-0198',
        location: 'Tallahassee, FL',
        skills: [
          'JavaScript',
          'React',
          'HTML/CSS',
          'Python',
          'Git',
          'REST APIs',
          'Agile Development',
          'UI/UX Design'
        ],
        education: 'B.S. Computer Science — Florida A&M University',
        experience:
          'Developed responsive web applications using React, collaborated in agile teams, and implemented UI components based on UX designs.',
        projects: [
          'DEI Builders Career Platform',
          'Student Portfolio Website',
          'Resume Analyzer Tool'
        ]
      };

      setResult(demoResult);

      // Deterministic fixed job matches as required
      const matchesList = [
        { title: 'Frontend Developer Intern', company: 'Google', skill: 'React' },
        { title: 'Software Engineer Intern', company: 'Meta', skill: 'JavaScript' },
        { title: 'Junior Web Developer', company: 'Adobe', skill: 'HTML/CSS' },
        { title: 'UI Engineer Intern', company: 'Netflix', skill: 'UI/UX Design' },
        { title: 'React Developer', company: 'Spotify', skill: 'React' }
      ];

      setMatches(matchesList);
      // Ensure matches loading stops immediately after populating matches
      setMatchesLoading(false);
    } finally {
      // Always reset loading flags to avoid stuck UI states
      setLoading(false);
      setMatchesLoading(false);
    }
  };

  // Reference these so ESLint won't flag them as unused. They are populated deterministically by processUpload.
  void matches;
  void matchesLoading;

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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.15rem', borderRadius: 999, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>
            ← Back to Dashboard
          </button>
        </div>
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
            style={{ ...styles.button, opacity: file ? 1 : 0.6, cursor: file ? 'pointer' : 'not-allowed' }}
            disabled={!file || loading}
          >
            {loading ? 'Analyzing…' : 'Upload'}
          </button>
        </form>

        <div style={{ marginTop: '0.75rem', color: '#9ca3af', fontSize: '0.875rem' }}>
          This is a demo. No real resume data is stored.
        </div>

        {result && (
          <div style={styles.resultCard} aria-live="polite">
            <h3 style={styles.sectionTitle}>Gemini Parsed Output</h3>
            <div style={{ marginTop: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Name</div>
                  <div style={{ fontWeight: 700 }}>{result.name}</div>
                </div>
                <div style={styles.successBadge}>Demo</div>
              </div>

              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Email</div>
                <div>{result.email}</div>
              </div>

              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Key Skills</div>
                <ul>
                  {(result.skills || []).map((s, i) => (
                    <li key={i} style={{ color: '#374151' }}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Education</div>
                <div>{result.education}</div>
              </div>

              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Experience Summary</div>
                <div>{result.experience}</div>
              </div>
            </div>
          </div>
        )}

        {/* Generated job matches section (demo) */}
        {result && (
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.45rem' }}>Generated by Gemini AI (Demo)</div>

            {matchesLoading && (
              <div style={{ ...styles.resultCard, padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#374151' }}>Gemini AI analyzing resume...</div>
              </div>
            )}

            {matches && (
              <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.4rem' }}>
                {matches.map((m, idx) => (
                  <div key={idx} style={styles.resultCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{m.skill || 'Skill'}</div>
                        <div style={{ fontWeight: 700 }}>{m.title}</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{m.company}</div>
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

