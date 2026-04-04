import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ── Get farmer info from localStorage ──────────────
  const farmerRaw = localStorage.getItem("farmer");
  const farmer = farmerRaw ? JSON.parse(farmerRaw) : null;
  const farmerId = localStorage.getItem("farmerId") || farmer?.id;
  const username = localStorage.getItem("username") || "Farmer";

  // ── State ───────────────────────────────────────────
  const [tab, setTab] = useState("dashboard");
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [cropName, setCropName] = useState("");
  const [yieldVal, setYieldVal] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [msg, setMsg] = useState("");
  const [searchCrop, setSearchCrop] = useState("");
  const [loading, setLoading] = useState(false);

  // Yield calc
  const [ycCrop, setYcCrop] = useState("Paddy (Rice)");
  const [ycArea, setYcArea] = useState(1);
  const [ycSq, setYcSq] = useState(0.85);
  const [ycIrr, setYcIrr] = useState(1);
  const [ycFert, setYcFert] = useState(1);

  // ── Auth guard & data load ──────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    loadAll();
  }, []);

  const loadAll = () => {
    if (!farmerId) return;
    setLoading(true);

    // Load crops
    fetch(`http://localhost:8081/crops/${farmerId}`)
      .then(r => r.json())
      .then(data => setCrops(Array.isArray(data) ? data : []))
      .catch(() => setCrops([]));

    // Load weather
    const loc = farmer?.location || "Vellore";
    fetch(`http://localhost:8081/weather/${loc}`)
      .then(r => r.json())
      .then(data => setWeather(data))
      .catch(() => setWeather(null));

    // Load suggestions
    const soil = farmer?.soilType || "Red Laterite";
    fetch(`http://localhost:8081/suggestions/${encodeURIComponent(soil)}`)
      .then(r => r.json())
      .then(data => setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  };

  // ── Chart.js yield bar chart ────────────────────────
  useEffect(() => {
    if (tab !== "crops" || crops.length === 0) return;
    const timeout = setTimeout(() => {
      if (!chartRef.current) return;
      if (chartInstance.current) chartInstance.current.destroy();

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
      script.onload = () => {
        if (!chartRef.current) return;
        chartInstance.current = new window.Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: crops.map(c => c.crop),
            datasets: [{
              label: "Yield (kg)",
              data: crops.map(c => Number(c.yieldValue) || 0),
              backgroundColor: crops.map((_, i) =>
                ["#2e7d32","#388e3c","#43a047","#4caf50","#66bb6a","#81c784"][i % 6]
              ),
              borderRadius: 6,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#f0f0f0" },
                ticks: { font: { size: 11 }, color: "#888" } },
              x: { grid: { display: false },
                ticks: { font: { size: 11 }, color: "#444" } }
            }
          }
        });
      };
      if (!document.querySelector('script[src*="chart.js"]')) document.head.appendChild(script);
      else if (window.Chart) script.onload();
    }, 100);
    return () => { clearTimeout(timeout); if (chartInstance.current) chartInstance.current.destroy(); };
  }, [tab, crops]);

  // ── Add crop ────────────────────────────────────────
  const addCrop = async () => {
    if (!cropName || !yieldVal) { alert("Enter crop name and yield"); return; }
    try {
      await fetch(`http://localhost:8081/crops/${farmerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop: cropName, yieldValue: yieldVal, date: harvestDate || undefined }),
      });
      const updated = await fetch(`http://localhost:8081/crops/${farmerId}`).then(r => r.json());
      setCrops(Array.isArray(updated) ? updated : []);
      setCropName(""); setYieldVal(""); setHarvestDate(""); setFieldName("");
      setMsg("✅ Crop added successfully!"); setTimeout(() => setMsg(""), 3000);
    } catch { alert("Error adding crop. Is backend running?"); }
  };

  const deleteCrop = async (index) => {
    if (!window.confirm("Remove this crop?")) return;
    const updated = crops.filter((_, i) => i !== index);
    setCrops(updated);
  };

  const logout = () => { localStorage.clear(); navigate("/"); };

  // ── Yield calculator ────────────────────────────────
  const yieldData = {
    "Paddy (Rice)": { base: 3.6, price: 19400, unit: "T/acre" },
    "Wheat":        { base: 3.2, price: 22000, unit: "T/acre" },
    "Cotton":       { base: 0.48, price: 65000, unit: "T/acre" },
    "Sugarcane":    { base: 40, price: 3150, unit: "T/acre" },
    "Maize":        { base: 2.8, price: 21000, unit: "T/acre" },
    "Groundnut":    { base: 1.4, price: 55000, unit: "T/acre" },
    "Tomato":       { base: 10, price: 8000, unit: "T/acre" },
    "Ragi":         { base: 1.2, price: 18000, unit: "T/acre" },
  };
  const yd = yieldData[ycCrop] || { base: 3.6, price: 19400, unit: "T/acre" };
  const totalYield = (yd.base * ycArea * ycSq * ycIrr * ycFert).toFixed(2);
  const revenue = Math.round(Number(totalYield) * yd.price).toLocaleString();
  const safeArr = Array.isArray(crops) ? crops : [];
  const totalCropYield = safeArr.reduce((a, c) => a + Number(c.yieldValue || 0), 0);
  const filteredCrops = safeArr.filter(c => c.crop?.toLowerCase().includes(searchCrop.toLowerCase()));

  const navItems = [
    { id: "dashboard", label: "Dashboard", ico: "🏠" },
    { id: "crops",     label: "My Crops",  ico: "🌾" },
    { id: "weather",   label: "Weather",   ico: "🌤️" },
    { id: "suggest",   label: "Suggestions", ico: "💡" },
    { id: "yield",     label: "Yield Calc", ico: "📊" },
  ];

  // ── Weather condition helper ────────────────────────
  const getWeatherCondition = (temp, humidity) => {
    if (!temp) return "Clear";
    if (humidity > 80) return "Humid / Cloudy";
    if (temp > 35) return "Hot & Sunny";
    if (temp < 20) return "Cool & Pleasant";
    return "Partly Cloudy";
  };

  const getAdvisory = (temp, humidity) => {
    if (!temp) return "Loading advisory...";
    if (humidity > 80) return "High humidity — watch for fungal diseases. Avoid overhead irrigation.";
    if (temp > 35) return "Very hot — water crops early morning and evening. Provide shade if possible.";
    if (temp < 20) return "Cool weather — ideal for Rabi crops. Monitor for frost at night.";
    return "Good conditions for fieldwork and fertilizer application today.";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f8e9", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <div style={{ width: "220px", background: "#1b5e20", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "1.5rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "700" }}>🌾 AgriSmart</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Farmer Portal</div>
        </div>
        <div style={{ padding: "1rem 0.8rem", flex: 1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width: "100%", padding: "10px 14px", marginBottom: "4px", borderRadius: "8px", border: "none",
              background: tab === n.id ? "rgba(255,255,255,0.2)" : "transparent",
              color: tab === n.id ? "white" : "rgba(255,255,255,0.72)",
              textAlign: "left", cursor: "pointer", fontSize: "13px",
              fontWeight: tab === n.id ? "600" : "400",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "all 0.15s",
            }}>{n.ico} {n.label}</button>
          ))}
        </div>
        <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "white" }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: "500" }}>{username}</div>
          </div>
          <button onClick={logout} style={{ width: "100%", padding: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Top Bar */}
        <div style={{ background: "white", padding: "1rem 1.5rem", borderBottom: "1px solid #e0f0d0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1a2e0a" }}>
              {navItems.find(n => n.id === tab)?.ico} {navItems.find(n => n.id === tab)?.label}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7a5e", marginTop: "2px" }}>
              {farmer?.location || "Your Farm"} · {farmer?.soilType || ""} · {farmer?.landSize || 0} acres
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {loading && <div style={{ fontSize: "12px", color: "#888" }}>Loading...</div>}
            <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              ID: {farmerId || "—"}
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>

          {/* ══════════════ DASHBOARD TAB ══════════════ */}
          {tab === "dashboard" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#1a2e0a" }}>
                  Good day, {username}! 👋
                </div>
                <div style={{ fontSize: "13px", color: "#6b7a5e" }}>Here's your farm overview</div>
              </div>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "1.5rem" }}>
                {[
                  { label: "Active Crops", value: safeArr.length, ico: "🌾", color: "#2e7d32" },
                  { label: "Total Yield (kg)", value: totalCropYield.toLocaleString(), ico: "📦", color: "#388e3c" },
                  { label: "Land Size", value: (farmer?.landSize || 0) + " ac", ico: "🗺️", color: "#1b5e20" },
                  { label: "Temperature", value: weather ? weather.temperature + "°C" : "--", ico: "🌡️", color: "#43a047" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "white", borderRadius: "12px", padding: "1.1rem 1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e8f5e9" }}>
                    <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{s.ico}</div>
                    <div style={{ fontSize: "1.7rem", fontWeight: "700", color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                {/* Weather Card */}
                <div style={S.card}>
                  <div style={S.cardTitle}>🌤️ Today's Weather</div>
                  {weather ? (
                    <div>
                      <div style={{ background: "linear-gradient(135deg,#2e7d32,#1b5e20)", color: "white", borderRadius: "10px", padding: "1.2rem" }}>
                        <div style={{ opacity: 0.8, fontSize: "12px", marginBottom: "4px" }}>📍 {farmer?.location || "Your Location"}</div>
                        <div style={{ fontSize: "2.8rem", fontWeight: "700" }}>{weather.temperature}°C</div>
                        <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>{getWeatherCondition(weather.temperature, weather.humidity)}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
                          {[["HUMIDITY", weather.humidity + "%"], ["RAIN", "25%"], ["WIND", "14 km/h"]].map(([l, v]) => (
                            <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
                              <div style={{ fontSize: "9px", opacity: 0.75 }}>{l}</div>
                              <div style={{ fontWeight: "600", fontSize: "12px", marginTop: "2px" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: "10px", padding: "10px", background: "#f0f9e8", borderRadius: "8px", fontSize: "12px", color: "#2e7d32" }}>
                        💡 {getAdvisory(weather.temperature, weather.humidity)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#999", fontSize: "13px" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌤️</div>
                      Loading weather data...
                    </div>
                  )}
                </div>

                {/* Recent Crops */}
                <div style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={S.cardTitle}>🌾 Recent Crops</div>
                    <button onClick={() => setTab("crops")} style={{ fontSize: "12px", color: "#2e7d32", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>View All →</button>
                  </div>
                  {safeArr.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", color: "#999", fontSize: "13px" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌱</div>
                      No crops yet. Go to My Crops to add.
                    </div>
                  ) : safeArr.slice(-5).reverse().map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2e7d32" }}></div>
                        <span style={{ fontWeight: "600", fontSize: "13px" }}>{c.crop}</span>
                      </div>
                      <span style={{ color: "#2e7d32", fontWeight: "600", fontSize: "13px" }}>{Number(c.yieldValue).toLocaleString()} kg</span>
                      <span style={{ color: "#bbb", fontSize: "11px" }}>{c.date || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div style={S.card}>
                <div style={S.cardTitle}>🔔 Farm Alerts</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { type: "info", msg: "🌧️ Light rain expected this week — plan irrigation accordingly." },
                    { type: "success", msg: "✅ Crop suggestions updated based on your soil type: " + (farmer?.soilType || "Red Laterite") },
                    { type: "warn", msg: "⚠️ Check your crops for pest activity — humidity is above 70%." },
                  ].map((a, i) => (
                    <div key={i} style={{
                      padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                      background: a.type === "success" ? "#e8f5e9" : a.type === "warn" ? "#fff8e1" : "#e3f2fd",
                      color: a.type === "success" ? "#1b5e20" : a.type === "warn" ? "#f57f17" : "#0d47a1",
                      border: `1px solid ${a.type === "success" ? "#c8e6c9" : a.type === "warn" ? "#ffe082" : "#bbdefb"}`,
                    }}>{a.msg}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ MY CROPS TAB ══════════════ */}
          {tab === "crops" && (
            <div>
              {/* Add Crop Form */}
              <div style={{ ...S.card, marginBottom: "1.2rem" }}>
                <div style={S.cardTitle}>➕ Add New Crop</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={S.lbl}>Crop Name *</label>
                    <select style={S.inp} value={cropName} onChange={e => setCropName(e.target.value)}>
                      <option value="">Select crop</option>
                      {["Paddy", "Wheat", "Cotton", "Sugarcane", "Maize", "Groundnut", "Tomato", "Ragi", "Mustard", "Sorghum", "Chickpea", "Lentils"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.lbl}>Yield (kg) *</label>
                    <input style={S.inp} type="number" placeholder="e.g. 3600" value={yieldVal} onChange={e => setYieldVal(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.lbl}>Field Name</label>
                    <input style={S.inp} type="text" placeholder="e.g. Block A" value={fieldName} onChange={e => setFieldName(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.lbl}>Harvest Date</label>
                    <input style={S.inp} type="date" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button style={S.btn} onClick={addCrop}>+ Add Crop</button>
                  {msg && <span style={{ color: "#2e7d32", fontSize: "13px", fontWeight: "500" }}>{msg}</span>}
                </div>
              </div>

              {/* Crop Table */}
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={S.cardTitle}>All Crops ({safeArr.length})</div>
                  <input
                    style={{ padding: "7px 12px", border: "1px solid #d4e8bb", borderRadius: "6px", fontSize: "12px", outline: "none", width: "200px" }}
                    placeholder="Search crops..."
                    value={searchCrop}
                    onChange={e => setSearchCrop(e.target.value)}
                  />
                </div>

                {filteredCrops.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#999", fontSize: "13px" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🌱</div>
                    {searchCrop ? "No crops match your search." : "No crops added yet. Add your first crop above!"}
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "#f0f9e8" }}>
                        {["#", "Crop", "Yield (kg)", "Date", "Action"].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCrops.map((c, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={S.td}>{i + 1}</td>
                          <td style={{ ...S.td, fontWeight: "600" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2e7d32", flexShrink: 0 }}></div>
                              {c.crop}
                            </div>
                          </td>
                          <td style={{ ...S.td, color: "#2e7d32", fontWeight: "600" }}>{Number(c.yieldValue || 0).toLocaleString()}</td>
                          <td style={{ ...S.td, color: "#999" }}>{c.date || "—"}</td>
                          <td style={S.td}>
                            <button onClick={() => deleteCrop(i)} style={{ padding: "4px 10px", background: "#fff0f0", color: "#c0392b", border: "1px solid #f5c6c6", borderRadius: "5px", cursor: "pointer", fontSize: "11px" }}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Yield Chart */}
                {safeArr.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                      📊 Yield Comparison Chart
                    </div>
                    <div style={{ height: "200px", position: "relative" }}>
                      <canvas ref={chartRef}></canvas>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ WEATHER TAB ══════════════ */}
          {tab === "weather" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={S.card}>
                <div style={S.cardTitle}>🌤️ Current Weather</div>
                {weather ? (
                  <div>
                    <div style={{ background: "linear-gradient(135deg,#2e7d32,#1b5e20)", color: "white", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
                      <div style={{ opacity: 0.8, fontSize: "13px", marginBottom: "4px" }}>📍 {farmer?.location || "Your Location"}</div>
                      <div style={{ fontSize: "4rem", fontWeight: "700", lineHeight: 1 }}>{weather.temperature}°C</div>
                      <div style={{ marginTop: "8px", opacity: 0.85, fontSize: "14px" }}>{getWeatherCondition(weather.temperature, weather.humidity)}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "16px" }}>
                        {[["💧 Humidity", weather.humidity + "%"], ["🌧️ Rain", "25%"], ["🌬️ Wind", "14 km/h"], ["☀️ UV Index", "High"], ["👁️ Visibility", "10 km"], ["🌡️ Feels Like", (weather.temperature - 2) + "°C"]].map(([l, v]) => (
                          <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                            <div style={{ fontSize: "10px", opacity: 0.75 }}>{l}</div>
                            <div style={{ fontWeight: "600", marginTop: "4px", fontSize: "13px" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px", background: "#f0f9e8", borderRadius: "8px", fontSize: "13px", color: "#2e7d32", border: "1px solid #c8e6c9" }}>
                      <strong>💡 Advisory: </strong>{getAdvisory(weather.temperature, weather.humidity)}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
                    <div style={{ fontSize: "3rem" }}>🌤️</div>
                    <div style={{ fontSize: "13px", marginTop: "8px" }}>Loading weather...</div>
                  </div>
                )}
              </div>

              <div style={S.card}>
                <div style={S.cardTitle}>🌾 Farming Advisory</div>
                {[
                  { ico: "🌱", title: "Irrigation", msg: "Water your crops early morning (5–7 AM) to reduce evaporation loss by up to 40%." },
                  { ico: "🧪", title: "Fertilizer", msg: "Apply NPK fertilizer after light rain for better soil absorption and nutrient uptake." },
                  { ico: "🐛", title: "Pest Control", msg: "Humidity above 70% increases fungal and pest risk. Spray neem oil as a preventive." },
                  { ico: "☀️", title: "Harvesting", msg: "Harvest in dry weather (below 60% humidity) to preserve crop quality and reduce spoilage." },
                  { ico: "🌿", title: "Soil Health", msg: "Add organic compost between crop cycles to improve soil structure and micronutrient levels." },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{a.ico}</div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#1a2e0a" }}>{a.title}</div>
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "3px", lineHeight: "1.5" }}>{a.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════ SUGGESTIONS TAB ══════════════ */}
          {tab === "suggest" && (
            <div>
              <div style={{ background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)", borderRadius: "10px", padding: "14px 18px", marginBottom: "1.2rem", border: "1px solid #a5d6a7" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1b5e20" }}>
                  💡 Personalised Crop Recommendations
                </div>
                <div style={{ fontSize: "12px", color: "#2e7d32", marginTop: "4px" }}>
                  Based on your soil type: <strong>{farmer?.soilType || "Red Laterite"}</strong> · Location: <strong>{farmer?.location || "Vellore"}</strong>
                </div>
              </div>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#999", background: "white", borderRadius: "12px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🌱</div>
                  <div style={{ fontSize: "13px" }}>Loading suggestions...</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
                  {suggestions.map((s, i) => (
                    <div key={i} style={{ ...S.card, borderLeft: "4px solid #2e7d32" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1b5e20" }}>{s.crop}</div>
                          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Recommended for {farmer?.soilType || "your soil"}</div>
                        </div>
                        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
                          {s.season}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {[["🌾 Expected Yield", s.yield], ["💧 Water Need", s.water]].map(([l, v]) => (
                          <div key={l} style={{ background: "#f7f9f4", borderRadius: "6px", padding: "8px 10px" }}>
                            <div style={{ fontSize: "11px", color: "#888" }}>{l}</div>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "2px" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => { setCropName(s.crop); setTab("crops"); }}
                        style={{ marginTop: "10px", width: "100%", padding: "7px", background: "#2e7d32", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                      >
                        + Add this crop
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ YIELD CALC TAB ══════════════ */}
          {tab === "yield" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={S.card}>
                <div style={S.cardTitle}>📊 Yield Calculator</div>
                <label style={S.lbl}>Crop</label>
                <select style={S.inp} value={ycCrop} onChange={e => setYcCrop(e.target.value)}>
                  {Object.keys(yieldData).map(c => <option key={c}>{c}</option>)}
                </select>

                <label style={S.lbl}>Land Area (acres)</label>
                <input style={S.inp} type="number" value={ycArea} min="0.1" step="0.1" onChange={e => setYcArea(Number(e.target.value) || 0.1)} />
// Feature: Multi-crop tracking with yield chart
                <label style={S.lbl}>Soil Quality</label>
                <select style={S.inp} value={ycSq} onChange={e => setYcSq(Number(e.target.value))}>
                  <option value={1}>Excellent (100%)</option>
                  <option value={0.85}>Good (85%)</option>
                  <option value={0.7}>Average (70%)</option>
                  <option value={0.55}>Poor (55%)</option>
                </select>

                <label style={S.lbl}>Irrigation Type</label>
                <select style={S.inp} value={ycIrr} onChange={e => setYcIrr(Number(e.target.value))}>
                  <option value={1}>Fully Irrigated (100%)</option>
                  <option value={0.85}>Partially Irrigated (85%)</option>
                  <option value={0.65}>Rain-fed (65%)</option>
                </select>

                <label style={S.lbl}>Fertilizer Usage</label>
                <select style={S.inp} value={ycFert} onChange={e => setYcFert(Number(e.target.value))}>
                  <option value={1}>Optimal (100%)</option>
                  <option value={0.85}>Moderate (85%)</option>
                  <option value={0.7}>Minimal (70%)</option>
                </select>
              </div>

              <div>
                {/* Result Card */}
                <div style={{ ...S.card, textAlign: "center", marginBottom: "14px", background: "linear-gradient(135deg,#f1f8e9,#e8f5e9)" }}>
                  <div style={S.cardTitle}>Estimated Yield</div>
                  <div style={{ fontSize: "3.5rem", fontWeight: "700", color: "#2e7d32", lineHeight: 1 }}>{totalYield}</div>
                  <div style={{ fontSize: "14px", color: "#888", marginTop: "6px" }}>Tonnes — {ycArea} acre(s) of {ycCrop}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "16px" }}>
                    {[
                      ["Base Yield", yd.base + " T/ac"],
                      ["Efficiency", (ycSq * ycIrr * ycFert * 100).toFixed(0) + "%"],
                      ["Total", totalYield + " T"],
                    ].map(([l, v]) => (
                      <div key={l} style={{ background: "white", borderRadius: "8px", padding: "10px", border: "1px solid #d4e8bb" }}>
                        <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.3px" }}>{l}</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#2e7d32", marginTop: "4px" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Card */}
                <div style={S.card}>
                  <div style={S.cardTitle}>💰 Revenue Estimate (MSP Rates)</div>
                  {[
                    ["MSP Price per Tonne", "₹" + yd.price.toLocaleString()],
                    ["Total Yield", totalYield + " T"],
                    ["Gross Revenue", "₹" + revenue],
                  ].map(([l, v], i) => (
                    <div key={l} style={{
                      display: "flex", justifyContent: "space-between", padding: "10px 0",
                      borderBottom: i < 2 ? "1px solid #f0f0f0" : "none",
                      fontSize: i === 2 ? "16px" : "13px",
                      fontWeight: i === 2 ? "700" : "400",
                      color: i === 2 ? "#2e7d32" : "#444"
                    }}>
                      <span style={{ color: i === 2 ? "#2e7d32" : "#888" }}>{l}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: "12px", padding: "10px", background: "#e8f5e9", borderRadius: "8px", fontSize: "12px", color: "#2e7d32" }}>
                    * Based on Minimum Support Price (MSP). Actual market price may vary.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Shared styles
const S = {
  card: { background: "white", borderRadius: "12px", padding: "1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e8f5e9" },
  cardTitle: { fontSize: "12px", fontWeight: "700", color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "1rem" },
  lbl: { display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#3a4a2e" },
  inp: { width: "100%", padding: "9px 12px", border: "1.5px solid #d4e8bb", borderRadius: "8px", fontSize: "13px", marginBottom: "12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f7f9f4" },
  btn: { padding: "10px 22px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  th: { textAlign: "left", padding: "9px 12px", background: "#f0f9e8", color: "#2e7d32", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.4px" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#333" },
};

export default FarmerDashboard;// crop management feature
// weather api feature
// yield calculator feature
// feat: crop management
// feat: weather api
