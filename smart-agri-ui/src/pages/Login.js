import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
    if (!username || !password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      if (data.role === "ADMIN") navigate("/admin");
      else navigate("/farmer");
    } catch {
      setError("Cannot connect to server. Make sure backend is running on port 8081.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.badge}>🌾 AgriSmart Platform</div>
          <h1 style={styles.heroTitle}>Smart Farming<br/>for a Better<br/>Harvest</h1>
          <p style={styles.heroSub}>Manage crops, track yields, get AI-powered recommendations and monitor your farm — all in one place.</p>
          <div style={styles.iconGrid}>
            {[["🌤️","Live Weather"],["🌱","Crop Advice"],["📊","Yield Track"],["🗓️","Harvest Plan"]].map(([ico,lbl])=>(
              <div key={lbl} style={styles.iconBox}><div style={{fontSize:"22px"}}>{ico}</div><div style={styles.iconLbl}>{lbl}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.logoRow}>🌿</div>
          <h2 style={styles.formTitle}>Welcome Back</h2>
          <p style={styles.formSub}>Sign in to your farm account</p>
          <label style={styles.label}>Username</label>
          <input style={styles.input} placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.btn} onClick={()=>handleLogin()} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={styles.divider}><span>or</span></div>
          <button style={styles.btnOutline} onClick={()=>navigate("/signup")}>Create Farmer Account</button>
          <p style={styles.hint}>Admin? Use username: <b>admin</b> / password: <b>admin123</b><br/>
            <span style={{fontSize:"11px",color:"#aaa"}}>(Run GET /auth/seed once to create admin)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"100vh"},
  left:{background:"#2e7d32",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem"},
  leftInner:{maxWidth:"340px"},
  badge:{background:"rgba(255,255,255,0.18)",color:"white",padding:"6px 14px",borderRadius:"20px",fontSize:"12px",fontWeight:"600",display:"inline-block",marginBottom:"1.5rem",letterSpacing:"1px"},
  heroTitle:{color:"white",fontSize:"2.6rem",fontWeight:"700",lineHeight:"1.2",margin:"0 0 1rem"},
  heroSub:{color:"rgba(255,255,255,0.82)",fontSize:"14px",lineHeight:"1.7",margin:"0 0 2rem"},
  iconGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",maxWidth:"240px"},
  iconBox:{background:"rgba(255,255,255,0.12)",borderRadius:"10px",padding:"14px",textAlign:"center"},
  iconLbl:{color:"rgba(255,255,255,0.85)",fontSize:"11px",marginTop:"6px"},
  right:{display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem",background:"white"},
  formBox:{width:"100%",maxWidth:"380px"},
  logoRow:{fontSize:"2.5rem",marginBottom:"1rem"},
  formTitle:{fontSize:"1.8rem",fontWeight:"700",margin:"0 0 0.3rem",color:"#1a2e0a"},
  formSub:{color:"#6b7a5e",fontSize:"14px",margin:"0 0 1.8rem"},
  label:{display:"block",fontSize:"13px",fontWeight:"600",marginBottom:"6px",color:"#3a4a2e"},
  input:{width:"100%",padding:"11px 14px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"14px",marginBottom:"14px",outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#f7f9f4"},
  error:{background:"#fff0f0",color:"#c0392b",border:"1px solid #f5c6c6",borderRadius:"8px",padding:"10px 14px",fontSize:"13px",marginBottom:"14px"},
  btn:{width:"100%",padding:"13px",background:"#2e7d32",color:"white",border:"none",borderRadius:"8px",fontSize:"15px",fontWeight:"600",cursor:"pointer",marginBottom:"12px"},
  divider:{textAlign:"center",color:"#aaa",fontSize:"13px",margin:"4px 0 12px",position:"relative"},
  btnOutline:{width:"100%",padding:"12px",background:"white",color:"#2e7d32",border:"1.5px solid #2e7d32",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer"},
  hint:{fontSize:"12px",color:"#999",marginTop:"16px",textAlign:"center",lineHeight:"1.6"},
};

export default Login;