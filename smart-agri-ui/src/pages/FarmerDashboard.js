import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const navigate = useNavigate();
  const farmer = JSON.parse(localStorage.getItem("farmer") || "null");
  const farmerId = localStorage.getItem("farmerId") || farmer?.id;
  const username = localStorage.getItem("username") || "Farmer";

  const [tab, setTab] = useState("dashboard");
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [cropName, setCropName] = useState("");
  const [yieldVal, setYieldVal] = useState("");
  const [msg, setMsg] = useState("");

  // Yield calc states
  const [ycCrop, setYcCrop] = useState("Paddy (Rice)");
  const [ycArea, setYcArea] = useState(1);
  const [ycSq, setYcSq] = useState(0.85);
  const [ycIrr, setYcIrr] = useState(1);

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    if (farmerId) {
      fetch(`http://localhost:8081/crops/${farmerId}`).then(r=>r.json()).then(setCrops).catch(()=>{});
      fetch(`http://localhost:8081/weather/${farmer?.location||"Vellore"}`).then(r=>r.json()).then(setWeather).catch(()=>{});
      fetch(`http://localhost:8081/suggestions/${farmer?.soilType||"Red Laterite"}`).then(r=>r.json()).then(d=>setSuggestions(d.suggestions||[])).catch(()=>{});
    }
  }, []);

  const addCrop = async () => {
    if (!cropName||!yieldVal) { alert("Enter crop and yield"); return; }
    await fetch(`http://localhost:8081/crops/${farmerId}`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ crop:cropName, yieldValue:yieldVal }),
    });
    const updated = await fetch(`http://localhost:8081/crops/${farmerId}`).then(r=>r.json());
    setCrops(updated); setCropName(""); setYieldVal("");
    setMsg("✅ Crop added!"); setTimeout(()=>setMsg(""),2500);
  };

  const logout = () => { localStorage.clear(); navigate("/"); };

  const yieldData = {"Paddy (Rice)":{base:3.6,price:19400},"Wheat":{base:3.2,price:22000},"Cotton":{base:0.48,price:65000},"Sugarcane":{base:40,price:3150},"Maize":{base:2.8,price:21000},"Groundnut":{base:1.4,price:55000}};
  const yd = yieldData[ycCrop] || {base:3.6,price:19400};
  const totalYield = (yd.base * ycArea * ycSq * ycIrr).toFixed(2);
  const revenue = Math.round(totalYield * yd.price).toLocaleString();
  const totalCropYield = crops.reduce((a,c)=>a+Number(c.yieldValue||0),0);

  const navItems = [
    {id:"dashboard",label:"Dashboard",ico:"🏠"},
    {id:"crops",label:"My Crops",ico:"🌾"},
    {id:"weather",label:"Weather",ico:"🌤️"},
    {id:"suggestions",label:"Suggestions",ico:"💡"},
    {id:"yield",label:"Yield Calc",ico:"📊"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f1f8e9",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      {/* SIDEBAR */}
      <div style={{width:"220px",background:"#1b5e20",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"1.5rem 1.2rem",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{color:"white",fontSize:"1.2rem",fontWeight:"700"}}>🌾 AgriSmart</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"12px",marginTop:"4px"}}>Farmer Portal</div>
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
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"12px",marginBottom:"8px"}}>👤 {username}</div>
          <button onClick={logout} style={{width:"100%",padding:"8px",background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflowY:"auto"}}>
        {/* TOP BAR */}
        <div style={{background:"white",padding:"1rem 1.5rem",borderBottom:"1px solid #e0f0d0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:"1.2rem",fontWeight:"700",color:"#1a2e0a"}}>{navItems.find(n=>n.id===tab)?.label}</div>
            <div style={{fontSize:"12px",color:"#6b7a5e"}}>{farmer?.location||"Your Farm"} · {farmer?.soilType||""} · {farmer?.landSize||0} acres</div>
          </div>
          <div style={{fontSize:"13px",color:"#2e7d32",fontWeight:"600"}}>Farmer ID: {farmerId}</div>
        </div>

        <div style={{padding:"1.5rem"}}>

          {/* ── DASHBOARD TAB ── */}
          {tab==="dashboard" && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"1.5rem"}}>
                {[
                  {label:"Total Crops",value:crops.length,ico:"🌾"},
                  {label:"Total Yield (kg)",value:totalCropYield.toLocaleString(),ico:"📦"},
                  {label:"Land Size",value:(farmer?.landSize||0)+" acres",ico:"🗺️"},
                  {label:"Weather",value:weather?weather.temperature+"°C":"--",ico:"🌡️"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:"12px",padding:"1rem 1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:"6px"}}>{s.ico}</div>
                    <div style={{fontSize:"1.6rem",fontWeight:"700",color:"#2e7d32"}}>{s.value}</div>
                    <div style={{fontSize:"12px",color:"#888",marginTop:"2px"}}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
                <div style={card}>
                  <div style={cardTitle}>🌤️ Today's Weather</div>
                  {weather ? (
                    <div style={{background:"#2e7d32",color:"white",borderRadius:"10px",padding:"1.2rem"}}>
                      <div style={{fontSize:"2.5rem",fontWeight:"700"}}>{weather.temperature}°C</div>
                      <div style={{opacity:0.85,fontSize:"13px",marginTop:"4px"}}>📍 {farmer?.location}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"12px"}}>
                        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:"8px",padding:"8px",textAlign:"center"}}>
                          <div style={{fontSize:"11px",opacity:0.75}}>HUMIDITY</div>
                          <div style={{fontWeight:"600",marginTop:"2px"}}>{weather.humidity}%</div>
                        </div>
                        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:"8px",padding:"8px",textAlign:"center"}}>
                          <div style={{fontSize:"11px",opacity:0.75}}>CONDITION</div>
                          <div style={{fontWeight:"600",marginTop:"2px"}}>Clear</div>
                        </div>
                      </div>
                    </div>
                  ) : <div style={{color:"#999",fontSize:"13px"}}>Loading weather...</div>}
                </div>
                <div style={card}>
                  <div style={cardTitle}>🌾 Recent Crops</div>
                  {crops.length===0 ? <div style={{color:"#999",fontSize:"13px"}}>No crops added yet. Go to My Crops tab.</div> :
                    crops.slice(-4).map((c,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f0f0f0",fontSize:"13px"}}>
                        <span style={{fontWeight:"600"}}>{c.crop}</span>
                        <span style={{color:"#2e7d32"}}>{Number(c.yieldValue).toLocaleString()} kg</span>
                        <span style={{color:"#999"}}>{c.date}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* ── MY CROPS TAB ── */}
          {tab==="crops" && (
            <div>
              <div style={{...card,marginBottom:"1.2rem"}}>
                <div style={cardTitle}>Add New Crop</div>
                <div style={{display:"flex",gap:"12px",flexWrap:"wrap",alignItems:"flex-end"}}>
                  <div>
                    <label style={lbl}>Crop Name</label>
                    <select style={inp} value={cropName} onChange={e=>setCropName(e.target.value)}>
                      <option value="">Select crop</option>
                      {["Paddy","Wheat","Cotton","Sugarcane","Maize","Groundnut","Tomato","Ragi","Mustard","Sorghum"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Yield (kg)</label>
                    <input style={inp} type="number" placeholder="e.g. 3600" value={yieldVal} onChange={e=>setYieldVal(e.target.value)} />
                  </div>
                  <button style={btn} onClick={addCrop}>+ Add Crop</button>
                  {msg && <span style={{color:"#2e7d32",fontSize:"13px"}}>{msg}</span>}
                </div>
              </div>
              <div style={card}>
                <div style={cardTitle}>All Crops ({crops.length})</div>
                {crops.length===0 ? <div style={{color:"#999",fontSize:"13px",padding:"1rem 0"}}>No crops added yet.</div> : (
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                    <thead><tr style={{background:"#f0f9e8"}}>
                      <th style={th}>#</th><th style={th}>Crop</th><th style={th}>Yield (kg)</th><th style={th}>Date</th>
                    </tr></thead>
                    <tbody>{crops.map((c,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                        <td style={td}>{i+1}</td>
                        <td style={{...td,fontWeight:"600"}}>{c.crop}</td>
                        <td style={{...td,color:"#2e7d32"}}>{Number(c.yieldValue).toLocaleString()}</td>
                        <td style={{...td,color:"#999"}}>{c.date}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── WEATHER TAB ── */}
          {tab==="weather" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div style={card}>
                <div style={cardTitle}>🌤️ Current Weather</div>
                {weather ? (
                  <div>
                    <div style={{background:"linear-gradient(135deg,#2e7d32,#1b5e20)",color:"white",borderRadius:"12px",padding:"1.5rem",marginBottom:"1rem"}}>
                      <div style={{opacity:0.8,fontSize:"13px"}}>📍 {farmer?.location}</div>
                      <div style={{fontSize:"3.5rem",fontWeight:"700",margin:"8px 0"}}>{weather.temperature}°C</div>
                      <div style={{opacity:0.85}}>Partly Cloudy</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                      {[["💧 Humidity",weather.humidity+"%"],["🌬️ Condition","Moderate"],["🌧️ Rain Chance","25%"],["☀️ UV Index","High"]].map(([l,v])=>(
                        <div key={l} style={{background:"#f7f9f4",borderRadius:"8px",padding:"12px",textAlign:"center"}}>
                          <div style={{fontSize:"12px",color:"#888"}}>{l}</div>
                          <div style={{fontSize:"1.1rem",fontWeight:"600",color:"#2e7d32",marginTop:"4px"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div style={{color:"#999"}}>Loading...</div>}
              </div>
              <div style={card}>
                <div style={cardTitle}>💡 Farming Advisory</div>
                {[
                  {ico:"🌱",title:"Irrigation",msg:"Water your crops in the early morning to reduce evaporation."},
                  {ico:"🧪",title:"Fertilizer",msg:"Apply fertilizer after light rain for better absorption."},
                  {ico:"🌿",title:"Pest Control",msg:"Inspect crops weekly. Humidity above 70% increases pest risk."},
                  {ico:"☀️",title:"Harvesting",msg:"Harvest in dry weather to preserve crop quality."},
                ].map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:"12px",padding:"10px 0",borderBottom:"1px solid #f0f0f0"}}>
                    <div style={{fontSize:"1.4rem"}}>{a.ico}</div>
                    <div><div style={{fontWeight:"600",fontSize:"13px"}}>{a.title}</div><div style={{fontSize:"12px",color:"#666",marginTop:"2px"}}>{a.msg}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUGGESTIONS TAB ── */}
          {tab==="suggestions" && (
            <div>
              <div style={{background:"#e8f5e9",borderRadius:"10px",padding:"12px 16px",marginBottom:"1.2rem",fontSize:"13px",color:"#2e7d32"}}>
                💡 Suggestions based on your soil type: <strong>{farmer?.soilType||"Red Laterite"}</strong>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"14px"}}>
                {suggestions.map((s,i)=>(
                  <div key={i} style={{...card,borderLeft:"4px solid #2e7d32"}}>
                    <div style={{fontSize:"1.2rem",fontWeight:"700",color:"#1b5e20",marginBottom:"4px"}}>{s.crop}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"10px"}}>
                      {[["🌾 Yield",s.yield],["🗓️ Season",s.season],["💧 Water",s.water]].map(([l,v])=>(
                        <div key={l} style={{background:"#f7f9f4",borderRadius:"6px",padding:"8px"}}>
                          <div style={{fontSize:"11px",color:"#888"}}>{l}</div>
                          <div style={{fontSize:"13px",fontWeight:"600",color:"#333",marginTop:"2px"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {suggestions.length===0 && <div style={{color:"#999",fontSize:"13px"}}>Loading suggestions...</div>}
              </div>
            </div>
          )}

          {/* ── YIELD CALC TAB ── */}
          {tab==="yield" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div style={card}>
                <div style={cardTitle}>📊 Yield Calculator</div>
                <label style={lbl}>Crop</label>
                <select style={inp} value={ycCrop} onChange={e=>setYcCrop(e.target.value)}>
                  {Object.keys(yieldData).map(c=><option key={c}>{c}</option>)}
                </select>
                <label style={lbl}>Land Area (acres)</label>
                <input style={inp} type="number" value={ycArea} min="0.1" step="0.1" onChange={e=>setYcArea(Number(e.target.value))} />
                <label style={lbl}>Soil Quality</label>
                <select style={inp} value={ycSq} onChange={e=>setYcSq(Number(e.target.value))}>
                  <option value={1}>Excellent</option><option value={0.85}>Good</option>
                  <option value={0.7}>Average</option><option value={0.55}>Poor</option>
                </select>
                <label style={lbl}>Irrigation Type</label>
                <select style={inp} value={ycIrr} onChange={e=>setYcIrr(Number(e.target.value))}>
                  <option value={1}>Fully Irrigated</option>
                  <option value={0.85}>Partially Irrigated</option>
                  <option value={0.65}>Rain-fed</option>
                </select>
              </div>
              <div>
                <div style={{...card,textAlign:"center",marginBottom:"14px"}}>
                  <div style={cardTitle}>Estimated Yield</div>
                  <div style={{fontSize:"3rem",fontWeight:"700",color:"#2e7d32"}}>{totalYield} T</div>
                  <div style={{fontSize:"13px",color:"#888",marginTop:"4px"}}>across {ycArea} acre(s) · {ycCrop}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginTop:"14px"}}>
                    {[["Base",yd.base+" T/ac"],["Efficiency",(ycSq*ycIrr*100).toFixed(0)+"%"],["Total",totalYield+" T"]].map(([l,v])=>(
                      <div key={l} style={{background:"#f0f9e8",borderRadius:"8px",padding:"10px"}}>
                        <div style={{fontSize:"11px",color:"#888"}}>{l}</div>
                        <div style={{fontSize:"14px",fontWeight:"600",color:"#2e7d32",marginTop:"2px"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={card}>
                  <div style={cardTitle}>💰 Revenue Estimate</div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}><span style={{color:"#888"}}>MSP Price</span><span>₹{yd.price.toLocaleString()}/T</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}><span style={{color:"#888"}}>Total Yield</span><span>{totalYield} T</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"16px",fontWeight:"700",padding:"10px 0",color:"#2e7d32"}}><span>Estimated Revenue</span><span>₹{revenue}</span></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const card={background:"white",borderRadius:"12px",padding:"1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:"1px solid #e8f5e9"};
const cardTitle={fontSize:"13px",fontWeight:"700",color:"#2e7d32",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"1rem"};
const lbl={display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#3a4a2e"};
const inp={width:"100%",padding:"9px 12px",border:"1.5px solid #d4e8bb",borderRadius:"8px",fontSize:"13px",marginBottom:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#f7f9f4"};
const btn={padding:"10px 20px",background:"#2e7d32",color:"white",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:"pointer"};
const th={textAlign:"left",padding:"8px 12px",background:"#f0f9e8",color:"#2e7d32",fontSize:"12px",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.3px"};
const td={padding:"10px 12px",fontSize:"13px",color:"#333"};

export default FarmerDashboard;