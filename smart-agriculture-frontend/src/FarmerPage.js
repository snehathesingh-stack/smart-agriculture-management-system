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

  const fetchFarmers = async () => {
    const response = await axios.get(`${API_BASE}/farmers`);
    setFarmers(response.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFarmer = async () => {
    await axios.post(`${API_BASE}/farmers`, form);
    fetchFarmers();
    setForm({
      name: "",
      phone: "",
      location: "",
      landArea: "",
      soilType: ""
    });
  };

  const deleteFarmer = async (id) => {
    await axios.delete(`${API_BASE}/farmers/${id}`);
    fetchFarmers();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🌾 Farmers</h2>

      {/* Add Farmer Form */}
      <div style={{ marginBottom: "20px" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="landArea" placeholder="Land Area" type="number" value={form.landArea} onChange={handleChange} />

        <select name="soilType" value={form.soilType} onChange={handleChange}>
          <option value="">Select Soil</option>
          <option value="Black">Black</option>
          <option value="Red">Red</option>
          <option value="Loamy">Loamy</option>
          <option value="Clay">Clay</option>
        </select>

        <button onClick={addFarmer}>Add Farmer</button>
      </div>

      {/* Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
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
          {farmers.map((farmer) => (
            <tr key={farmer.id}>
              <td>{farmer.id}</td>
              <td>{farmer.name}</td>
              <td>{farmer.phone}</td>
              <td>{farmer.location}</td>
              <td>{farmer.landArea}</td>
              <td>{farmer.soilType}</td>
              <td>
                <button onClick={() => openCropPage(farmer)}>
                  View Crops
                </button>
              </td>
              <td>
                <button onClick={() => deleteFarmer(farmer.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FarmerPage;