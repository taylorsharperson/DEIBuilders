import React from "react";
import Workshops from "../components/Workshops";
import { useNavigate } from "react-router-dom";

export default function WorkshopsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", padding: "4.5rem 2rem", background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)" }}>
      <div style={{ width: "min(1100px, 98vw)", margin: "0 auto", background: "#fff", border: "1px solid #eef2f6", borderRadius: 26, padding: "3rem", boxShadow: "0 30px 80px rgba(15,23,42,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Workshops</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "0.75rem 1.15rem", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700 }}>
            ← Back to Dashboard
          </button>
        </div>

        <Workshops />
      </div>
    </div>
  );
}
