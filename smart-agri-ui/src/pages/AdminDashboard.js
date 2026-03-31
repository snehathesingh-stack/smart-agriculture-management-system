import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({});
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({ name:"", location:"", soilType:"", landSize:"" });
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("role") !== "ADMIN") { navigate("/"); return; }
    loadFarmers();
    fetch("http://localhost:8081/dashboard").then(r=>r.json()).then(setStats).catch(()=>{});
  }, []);

  const loadFarmers = () => {
    fetch("http://localhost:8081/farmers").then(r=>r.json()).then(setFarmers).catch(()=>{});
  };

  const addFarmer = async () => {
    if (!form.name||!form.location||!form.soilType||!form.landSize) { alert("Fill all fields"); return; }
    await fetch("http://localhost:8081/farmers", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ...form, landSize: Number(form.landSize) }),
    });
    loadFarmers();
    setForm({ name:"", location:"", soilType:"", landSize:"" });
    setMsg("✅ Farmer added!"); setTimeout(()=>setMsg(""),2500);
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Delete this farmer?")) return;
    await fetch(`http://localhost:8081/farmers/${id}`, { method:"DELETE" });
    loadFarmers();
  };

  const logout = () => { localStorage.clear(); navigate("/"); };
  const filtered = farmers.filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.location?.toLowerCase().includes(search.toLowerCase()));

  const navItems = [
    {id:"overview",label:"Overview",ico:"📊"},
    {id:"farmers",label:"All Farmers",ico:"👨‍🌾"},
    {id:"add",label:"Add Farmer",ico:"➕"},
  ];

  const soils = ["Red Laterite","Black Cotton","Alluvial","Sandy Loam","Clay"];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f7f9f4",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      {/* SIDEBAR */}
      <div style={{width:"220px",background:"#1a2e0a",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"1.5rem 1.2rem",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{color:"white",fontSize:"1.2rem",fontWeight:"700"}}>🌾 AgriSmart</div>
          <div style={{background:"#f0ad4e",color:"#633806",padding:"3px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:"700",display:"inline-block",marginTop:"6px"}}>ADMIN</div>
        </div>
        <div style={{padding:"1rem 0.8rem",flex:1}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{
              width:"100%",padding:"10px 12px",marginBottom:"4px",borderRadius:"8px",border:"none",
              background:tab===n.id?"rgba(255,255,255,0.2)":"transparent",
              color:tab===n.id?"white":"rgba(255,255,255,0.75)",
              textAlign:"left",cursor:"pointer",fontSize:"13px",fontWeight:tab===n.id?"600":"400",
              display:"flex",alignItems:"center",gap:"10px"
            }}>{n.ico} {n.label}</button>
          ))}
        </div>
        <div style={{padding:"1rem",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"12px",marginBottom:"8px"}}>👤 Admin</div>
          <button onClick={logout} style={{width:"100%",padding:"8px",background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{background:"white",padding:"1rem 1.5rem",borderBottom:"1px solid #e0f0d0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:"1.2rem",fontWeight:"700",color:"#1a2e0a"}}>{navItems.find(n=>n.id===tab)?.label}</div>
          <div style={{fontSize:"12px",color:"#888"}}>Smart Agriculture System — Admin Panel</div>
        </div>

        <div style={{padding:"1.5rem"}}>

          {/* ── OVERVIEW TAB ── */}
          {tab==="overview" && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"1.5rem"}}>
                {[
                  {label:"Total Farmers",value:stats.totalFarmers||farmers.length,ico:"👨‍🌾"},
                  {label:"Total Crops",value:stats.totalCrops||0,ico:"🌾"},
                  {label:"Avg Temp",value:(stats.avgTemperature||29.5)+"°C",ico:"🌡️"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:"12px",padding:"1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"}}>
                    <div style={{fontSize:"1.8rem",marginBottom:"6px"}}>{s.ico}</div>
                    <div style={{fontSize:"2rem",fontWeight:"700",color:"#2e7d32"}}>{s.value}</div>
                    <div style={{fontSize:"12px",color:"#888",marginTop:"2px"}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"white",borderRadius:"12px",padding:"1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"}}>
                <div style={{fontSize:"13px",fontWeight:"700",color:"#2e7d32",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"1rem"}}>Crop Distribution by Soil Type</div>
                {soils.map((s,i)=>{
                  const count = farmers.filter(f=>f.soilType===s).length;
                  const pct = farmers.length ? Math.round(count/farmers.length*100) : 0;
                  return (
                    <div key={s} style={{marginBottom:"12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",marginBottom:"4px"}}>
                        <span style={{color:"#333"}}>{s}</span>
                        <span style={{color:"#888"}}>{count} farmers ({pct}%)</span>
                      </div>
                      <div style={{height:"6px",background:"#e8f5e9",borderRadius:"3px",overflow:"hidden"}}>
                        <div style={{height:"100%",width:pct+"%",background:"#2e7d32",borderRadius:"3px",transition:"width 0.6s"}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── FARMERS TAB ── */}
          {tab==="farmers" && (
            <div style={{background:"white",borderRadius:"12px",padding:"1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"}}>
              <div style={{marginBottom:"1rem"}}>
                <input style={{padding:"9px 14px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"13px",width:"280px",outline:"none",background:"#f7f9f4"}}
                  placeholder="Search by name or city..." value={search} onChange={e=>setSearch(e.target.value)} />
                <span style={{marginLeft:"12px",fontSize:"12px",color:"#888"}}>{filtered.length} farmer(s) found</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                <thead><tr style={{background:"#f0f9e8"}}>
                  {["ID","Name","Location","Soil Type","Land (acres)","Action"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"10px 12px",color:"#2e7d32",fontSize:"12px",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.3px"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map((f,i)=>(
                    <tr key={f.id} style={{borderBottom:"1px solid #f5f5f5",background:i%2===0?"white":"#fafafa"}}>
                      <td style={{padding:"10px 12px",color:"#999"}}>{f.id}</td>
                      <td style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                          <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"#e8f5e9",color:"#2e7d32",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"600"}}>
                            {f.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          <span style={{fontWeight:"600"}}>{f.name}</span>
                        </div>
                      </td>
                      <td style={{padding:"10px 12px",color:"#555"}}>📍 {f.location}</td>
                      <td style={{padding:"10px 12px"}}>
                        <span style={{background:"#e8f5e9",color:"#1b5e20",padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"600"}}>{f.soilType}</span>
                      </td>
                      <td style={{padding:"10px 12px",fontWeight:"600",color:"#2e7d32"}}>{f.landSize} ac</td>
                      <td style={{padding:"10px 12px"}}>
                        <button onClick={()=>deleteFarmer(f.id)} style={{padding:"5px 12px",background:"#fff0f0",color:"#c0392b",border:"1px solid #f5c6c6",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length===0 && <tr><td colSpan="6" style={{textAlign:"center",padding:"2rem",color:"#999"}}>No farmers found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* ── ADD FARMER TAB ── */}
          {tab==="add" && (
            <div style={{maxWidth:"500px"}}>
              <div style={{background:"white",borderRadius:"12px",padding:"1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"}}>
                <div style={{fontSize:"13px",fontWeight:"700",color:"#2e7d32",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"1.2rem"}}>Add New Farmer</div>
                {[
                  {label:"Full Name",key:"name",placeholder:"e.g. Ravi Kumar"},
                  {label:"City / Village",key:"location",placeholder:"e.g. Vellore"},
                  {label:"Land Area (acres)",key:"landSize",placeholder:"e.g. 2.5",type:"number"},
                ].map(f=>(
                  <div key={f.key}>
                    <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#3a4a2e"}}>{f.label}</label>
                    <input style={{width:"100%",padding:"10px 12px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"13px",marginBottom:"12px",outline:"none",boxSizing:"border-box",background:"#f7f9f4"}}
                      placeholder={f.placeholder} type={f.type||"text"}
                      value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} />
                  </div>
                ))}
                <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#3a4a2e"}}>Soil Type</label>
                <select style={{width:"100%",padding:"10px 12px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"13px",marginBottom:"16px",outline:"none",background:"#f7f9f4"}}
                  value={form.soilType} onChange={e=>setForm(p=>({...p,soilType:e.target.value}))}>
                  <option value="">Select soil type</option>
                  {soils.map(s=><option key={s}>{s}</option>)}
                </select>
                {msg && <div style={{background:"#e8f5e9",color:"#1b5e20",border:"1px solid #c0dd97",borderRadius:"8px",padding:"10px",fontSize:"13px",marginBottom:"12px"}}>{msg}</div>}
                <button onClick={addFarmer} style={{width:"100%",padding:"13px",background:"#2e7d32",color:"white",border:"none",borderRadius:"8px",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>
                  + Add Farmer
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;