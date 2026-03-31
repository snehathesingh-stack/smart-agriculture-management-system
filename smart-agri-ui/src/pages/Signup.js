import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:"", password:"", name:"", location:"", soilType:"", landSize:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSignup = async () => {
    if (!form.username||!form.password||!form.name||!form.location||!form.soilType||!form.landSize) {
      setError("Please fill all fields"); return;
    }
    setLoading(true); setError("");
    try {
      const uRes = await fetch("http://localhost:8081/auth/signup", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:form.username, password:form.password }),
      });
      const uData = await uRes.json();
      if (!uRes.ok) { setError(uData.error||"Signup failed"); setLoading(false); return; }
      const fRes = await fetch("http://localhost:8081/farmers", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:form.name, location:form.location, soilType:form.soilType, landSize:Number(form.landSize) }),
      });
      const fData = await fRes.json();
      localStorage.setItem("farmerId", fData.id);
      alert(`✅ Registered!\nUsername: ${form.username}\nFarmer ID: ${fData.id}\n\nSave this Farmer ID!`);
      navigate("/");
    } catch { setError("Cannot connect to server. Start backend first."); }
    setLoading(false);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"100vh"}}>
      <div style={{background:"#1b5e20",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem"}}>
        <div style={{maxWidth:"320px"}}>
          <div style={{background:"rgba(255,255,255,0.18)",color:"white",padding:"6px 14px",borderRadius:"20px",fontSize:"12px",fontWeight:"600",display:"inline-block",marginBottom:"1.5rem"}}>🌾 New Farmer Registration</div>
          <h1 style={{color:"white",fontSize:"2.2rem",fontWeight:"700",lineHeight:"1.3",margin:"0 0 1rem"}}>Join Thousands<br/>of Smart Farmers</h1>
          <p style={{color:"rgba(255,255,255,0.82)",fontSize:"14px",lineHeight:"1.7",margin:"0 0 1.5rem"}}>Get personalised crop suggestions, real-time weather, and complete harvest management.</p>
          {["📍 Location-based crop advice","🧪 Soil-specific suggestions","💧 Irrigation planning","💰 Yield & revenue tracking"].map(f=>(
            <div key={f} style={{color:"rgba(255,255,255,0.88)",fontSize:"13px",background:"rgba(255,255,255,0.1)",padding:"8px 14px",borderRadius:"8px",marginBottom:"8px"}}>{f}</div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",background:"#f7f9f4",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:"420px",background:"white",borderRadius:"16px",padding:"2rem",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <h2 style={{fontSize:"1.6rem",fontWeight:"700",margin:"0 0 0.2rem",color:"#1a2e0a"}}>Create Account</h2>
          <p style={{color:"#6b7a5e",fontSize:"13px",margin:"0 0 1.5rem"}}>Fill in your details to get started</p>
          <div style={{fontSize:"11px",fontWeight:"700",color:"#2e7d32",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"10px",paddingBottom:"6px",borderBottom:"1px solid #e8f5e9"}}>Account Details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <div><label style={lbl}>Username</label><input style={inp} placeholder="e.g. ravi123" onChange={e=>update("username",e.target.value)} /></div>
            <div><label style={lbl}>Password</label><input style={inp} type="password" placeholder="Min 6 chars" onChange={e=>update("password",e.target.value)} /></div>
          </div>
          <div style={{fontSize:"11px",fontWeight:"700",color:"#2e7d32",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"10px",paddingBottom:"6px",borderBottom:"1px solid #e8f5e9"}}>Farm Details</div>
          <label style={lbl}>Full Name</label>
          <input style={inp} placeholder="e.g. Ravi Kumar" onChange={e=>update("name",e.target.value)} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <div><label style={lbl}>City / Village</label><input style={inp} placeholder="e.g. Vellore" onChange={e=>update("location",e.target.value)} /></div>
            <div><label style={lbl}>Land (acres)</label><input style={inp} type="number" placeholder="e.g. 2.5" onChange={e=>update("landSize",e.target.value)} /></div>
          </div>
          <label style={lbl}>Soil Type</label>
          <select style={inp} defaultValue="" onChange={e=>update("soilType",e.target.value)}>
            <option value="" disabled>Select soil type</option>
            {["Red Laterite","Black Cotton","Alluvial","Sandy Loam","Clay"].map(s=><option key={s}>{s}</option>)}
          </select>
          {error && <div style={{background:"#fff0f0",color:"#c0392b",border:"1px solid #f5c6c6",borderRadius:"8px",padding:"10px",fontSize:"13px",marginBottom:"12px"}}>{error}</div>}
          <button style={{width:"100%",padding:"13px",background:"#2e7d32",color:"white",border:"none",borderRadius:"8px",fontSize:"15px",fontWeight:"600",cursor:"pointer"}} onClick={handleSignup} disabled={loading}>
            {loading?"Registering...":"Create My Account"}
          </button>
          <p style={{textAlign:"center",fontSize:"13px",color:"#888",marginTop:"14px"}}>Already registered? <span style={{color:"#2e7d32",cursor:"pointer",fontWeight:"600"}} onClick={()=>navigate("/")}>Sign In</span></p>
        </div>
      </div>
    </div>
  );
}
const lbl={display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#3a4a2e"};
const inp={width:"100%",padding:"10px 12px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"13px",marginBottom:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#f7f9f4"};
export default Signup;