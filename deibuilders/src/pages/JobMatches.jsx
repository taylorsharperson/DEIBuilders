import React from "react";
import { useNavigate } from "react-router-dom";

export default function JobMatches() {
  const navigate = useNavigate();
  // Deterministic demo skills shared with Resume Analyzer
  const demoSkills = ["JavaScript","React","HTML/CSS","Python","Git","REST APIs","UI/UX Design"];

  // Expanded deterministic demo job matches (12+ jobs)
  const demoJobMatches = [
    { title: 'Frontend Developer Intern', company: 'Google', location: 'Remote', type: 'Internship', skills: ['React','JavaScript','HTML/CSS'] },
    { title: 'Software Engineer Intern', company: 'Meta', location: 'Menlo Park, CA', type: 'Internship', skills: ['JavaScript','Python','Git'] },
    { title: 'React Developer', company: 'Spotify', location: 'New York, NY', type: 'Full-time', skills: ['React','REST APIs','JavaScript'] },
    { title: 'UI Engineer', company: 'Netflix', location: 'Los Gatos, CA', type: 'Full-time', skills: ['UI/UX Design','React','HTML/CSS'] },
    { title: 'Junior Web Developer', company: 'Adobe', location: 'San Jose, CA', type: 'Contract', skills: ['HTML/CSS','JavaScript','Git'] },
    { title: 'Frontend Engineer', company: 'Microsoft', location: 'Redmond, WA', type: 'Full-time', skills: ['React','TypeScript','REST APIs'] },
    { title: 'Web Application Developer', company: 'IBM', location: 'Remote', type: 'Full-time', skills: ['JavaScript','React','Git'] },
    { title: 'Junior Software Engineer', company: 'Salesforce', location: 'San Francisco, CA', type: 'Full-time', skills: ['JavaScript','Python','REST APIs'] },
    { title: 'Product Engineering Intern', company: 'Amazon', location: 'Seattle, WA', type: 'Internship', skills: ['JavaScript','React','Git'] },
    { title: 'Application Developer', company: 'Apple', location: 'Cupertino, CA', type: 'Full-time', skills: ['UI/UX Design','HTML/CSS','React'] },
    { title: 'Frontend Developer', company: 'LinkedIn', location: 'Sunnyvale, CA', type: 'Full-time', skills: ['React','JavaScript','HTML/CSS'] },
    { title: 'React Frontend Intern', company: 'Stripe', location: 'Remote', type: 'Internship', skills: ['React','JavaScript','REST APIs'] },
    { title: 'UI/UX Developer', company: 'Adobe', location: 'Remote', type: 'Full-time', skills: ['UI/UX Design','HTML/CSS','JavaScript'] },
    { title: 'Mobile Web Developer', company: 'Spotify', location: 'Remote', type: 'Contract', skills: ['React','HTML/CSS','JavaScript'] }
  ];

  // Map demo jobs into the same UI rendering used below
  const renderedJobs = demoJobMatches.map((job, idx) => ({ ...job, id: `demo-${idx}` }));

  return (
    <div style={{ minHeight: "100vh", padding: "4.5rem 2rem", background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)" }}>
      <div style={{ width: "min(1100px, 98vw)", margin: "0 auto", background: "#fff", border: "1px solid #eef2f6", borderRadius: 26, padding: "3rem", boxShadow: "0 30px 80px rgba(15,23,42,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Job Matches</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "0.75rem 1.15rem", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Job cards grid - uses existing layout and styles only */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {renderedJobs.map((j) => (
            <div key={j.id} style={{ border: '1px solid #eef2f6', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 8px 20px rgba(15,23,42,0.04)' }}>
              <div style={{ fontSize: 14, color: '#6b7280' }}>{j.type}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{j.title}</div>
              <div style={{ marginTop: 6, color: '#374151', fontWeight: 700 }}>{j.company}</div>
              <div style={{ marginTop: 6, color: '#6b7280' }}>{j.location}</div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(j.skills || []).slice(0,4).map((s, i) => (
                  <div key={i} style={{ padding: '0.25rem 0.5rem', borderRadius: 8, background: '#f3f4f6', fontSize: 12 }}>{s}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
