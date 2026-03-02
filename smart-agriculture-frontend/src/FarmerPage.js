import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://smart-agriculture-backend-wsh4.onrender.com";

function FarmerPage({ openCropPage }) {

  const [farmers, setFarmers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    landArea: "",
    soilType: ""
  });

  useEffect(() => {
    fetchFarmers();
  }, []);

  // ✅ SAFELY HANDLE ANY BACKEND RESPONSE
  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/farmers`);
      const data = response.data;

      if (Array.isArray(data)) {
        setFarmers(data);
      } else if (Array.isArray(data.data)) {
        setFarmers(data.data);
      } else {
        setFarmers([]);
      }

    } catch (error) {
      console.error("Error fetching farmers:", error);
      setFarmers([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFarmer = async () => {
    try {
      await axios.post(`${API_BASE}/farmers`, {
        ...form,
        landArea: parseFloat(form.landArea)
      });

      fetchFarmers();

      setForm({
        name: "",
        phone: "",
        location: "",
        landArea: "",
        soilType: ""
      });

    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  const deleteFarmer = async (id) => {
    try {
      await axios.delete(`${API_BASE}/farmers/${id}`);
      fetchFarmers();
    } catch (error) {
      console.error("Error deleting farmer:", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#2e7d32" }}>🌾 Farmers</h2>

      {/* Add Farmer Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="landArea"
          type="number"
          placeholder="Land Area"
          value={form.landArea}
          onChange={handleChange}
        />

        <select
          name="soilType"
          value={form.soilType}
          onChange={handleChange}
        >
          <option value="">Select Soil</option>
          <option value="Black">Black</option>
          <option value="Red">Red</option>
          <option value="Loamy">Loamy</option>
          <option value="Clay">Clay</option>
        </select>

        <button
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            background: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={addFarmer}
        >
          Add Farmer
        </button>
      </div>

      {/* Farmers Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
        border="1"
      >
        <thead>
          <tr style={{ background: "#2e7d32", color: "white" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Land</th>
            <th>Soil</th>
            <th>Crops</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {farmers.length > 0 ? (
            farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.id}</td>
                <td>{farmer.name}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.location}</td>
                <td>{farmer.landArea}</td>
                <td>{farmer.soilType}</td>
                <td>
                  <button
                    style={{
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    onClick={() => openCropPage(farmer)}
                  >
                    View Crops
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    onClick={() => deleteFarmer(farmer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Farmers Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FarmerPage;