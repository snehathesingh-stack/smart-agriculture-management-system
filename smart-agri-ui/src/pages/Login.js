import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");

    try {
      // ── Step 1: Authenticate ──────────────────────────────
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || username);

      if (data.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      // ── Step 2: Find farmer profile ───────────────────────
      // Try exact name match first using new endpoint
      let farmerObj = null;

      try {
        // Try /farmers/by-name/{username} — exact match
        const byNameRes = await fetch(
          `http://localhost:8081/farmers/by-name/${encodeURIComponent(username)}`
        );
        if (byNameRes.ok) {
          farmerObj = await byNameRes.json();
        }
      } catch (e) {}

      // Fallback: scan all farmers
      if (!farmerObj) {
        try {
          const allRes = await fetch("http://localhost:8081/farmers");
          const all = await allRes.json();
          if (Array.isArray(all) && all.length > 0) {
            const uLower = username.toLowerCase().trim();
            // Try various matching strategies
            farmerObj =
              all.find(f => f.name?.toLowerCase().trim() === uLower) ||
              all.find(f => f.name?.toLowerCase().includes(uLower)) ||
              all.find(f => uLower.includes(f.name?.toLowerCase().trim())) ||
              all[all.length - 1]; // last created as final fallback
          }
        } catch (e) {}
      }

      if (farmerObj) {
        localStorage.setItem("farmer", JSON.stringify(farmerObj));
        localStorage.setItem("farmerId", String(farmerObj.id));
      }

      navigate("/farmer");

    } catch (e) {
      setError("Cannot connect to server. Make sure backend is running on port 8081.");
    }
    setLoading(false);
  };
// Feature: Farmer Login with JWT Authentication
  return (
    <div style={S.page}>
      {/* LEFT */}
      <div style={S.left}>
        <div style={{ maxWidth: "340px" }}>
          <div style={S.badge}>🌾 AgriSmart Platform</div>
          <h1 style={S.heroTitle}>Smart Farming<br />for a Better<br />Harvest</h1>
          <p style={S.heroSub}>
            Manage crops, track yields, get personalised recommendations
            and monitor your farm — all in one place.
          </p>
          <div style={S.iconGrid}>
            {[["🌤️","Live Weather"],["🌱","Crop Advice"],["📊","Yield Track"],["🗓️","Harvest Plan"]].map(([ico,lbl]) => (
              <div key={lbl} style={S.iconBox}>
                <div style={{ fontSize: "22px" }}>{ico}</div>
                <div style={S.iconLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={S.right}>
        <div style={S.formBox}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🌿</div>
          <h2 style={S.formTitle}>Welcome Back</h2>
          <p style={S.formSub}>Sign in to your farm account</p>

          <label style={S.label}>Username</label>
          <input
            style={S.input}
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />

          <label style={S.label}>Password</label>
          <input
            style={S.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />

          {error && <div style={S.error}>{error}</div>}

          <button style={S.btn} onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={{ textAlign:"center", margin:"10px 0", color:"#ccc", fontSize:"13px" }}>or</div>

          <button style={S.btnOut} onClick={() => navigate("/signup")}>
            Create Farmer Account
          </button>

          <p style={S.hint}>
            <strong>Admin login:</strong> username: <code>admin</code> · password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:    { display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" },
  left:    { background:"#2e7d32", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem" },
  badge:   { background:"rgba(255,255,255,0.18)", color:"white", padding:"6px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", display:"inline-block", marginBottom:"1.5rem" },
  heroTitle:{ color:"white", fontSize:"2.6rem", fontWeight:"700", lineHeight:"1.2", margin:"0 0 1rem" },
  heroSub: { color:"rgba(255,255,255,0.82)", fontSize:"14px", lineHeight:"1.7", margin:"0 0 2rem" },
  iconGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", maxWidth:"240px" },
  iconBox: { background:"rgba(255,255,255,0.12)", borderRadius:"10px", padding:"14px", textAlign:"center" },
  iconLbl: { color:"rgba(255,255,255,0.85)", fontSize:"11px", marginTop:"6px" },
  right:   { display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem", background:"white" },
  formBox: { width:"100%", maxWidth:"380px" },
  formTitle:{ fontSize:"1.8rem", fontWeight:"700", margin:"0 0 0.3rem", color:"#1a2e0a" },
  formSub: { color:"#6b7a5e", fontSize:"14px", margin:"0 0 1.8rem" },
  label:   { display:"block", fontSize:"13px", fontWeight:"600", marginBottom:"6px", color:"#3a4a2e" },
  input:   { width:"100%", padding:"11px 14px", border:"1.5px solid #d4e8bb", borderRadius:"8px", fontSize:"14px", marginBottom:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#f7f9f4" },
  error:   { background:"#fff0f0", color:"#c0392b", border:"1px solid #f5c6c6", borderRadius:"8px", padding:"10px 14px", fontSize:"13px", marginBottom:"14px" },
  btn:     { width:"100%", padding:"13px", background:"#2e7d32", color:"white", border:"none", borderRadius:"8px", fontSize:"15px", fontWeight:"600", cursor:"pointer", marginBottom:"4px" },
  btnOut:  { width:"100%", padding:"12px", background:"white", color:"#2e7d32", border:"1.5px solid #2e7d32", borderRadius:"8px", fontSize:"14px", fontWeight:"600", cursor:"pointer" },
  hint:    { fontSize:"12px", color:"#999", marginTop:"16px", textAlign:"center", lineHeight:"1.8" },
};

export default Login;// farmer login feature
// feat: farmer login
