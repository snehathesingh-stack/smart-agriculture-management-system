import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://smart-agriculture-backend-wsh4.onrender.com";

function CropPage({ farmer }) {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({
    cropName: "",
    season: "",
    expectedYield: "",
    actualYield: "",
    marketPrice: "",
  });

  useEffect(() => {
    if (farmer) {
      fetchCrops();
    }
  }, [farmer]);

  const fetchCrops = async () => {
    const response = await axios.get(
      `${API_BASE}/farmers/${farmer.id}/crops`
    );
    setCrops(response.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCrop = async () => {
    await axios.post(
      `${API_BASE}/farmers/${farmer.id}/crops`,
      form
    );
    fetchCrops();
    setForm({
      cropName: "",
      season: "",
      expectedYield: "",
      actualYield: "",
      marketPrice: "",
    });
  };

  // ✅ DELETE CROP (NOW INSIDE COMPONENT)
  const deleteCrop = async (id) => {
    await axios.delete(
      `${API_BASE}/farmers/${farmer.id}/crops/${id}`
    );
    fetchCrops();
  };

  const totalRevenue = crops.reduce(
    (sum, crop) => sum + crop.actualYield * crop.marketPrice,
    0
  );

  if (!farmer) return null;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#2e7d32" }}>
        🌱 Crops of {farmer.name} (ID: {farmer.id})
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <select name="cropName" value={form.cropName} onChange={handleChange}>
          <option value="">Select Crop</option>
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Cotton">Cotton</option>
          <option value="Sugarcane">Sugarcane</option>
        </select>

        <select name="season" value={form.season} onChange={handleChange}>
          <option value="">Select Season</option>
          <option value="Kharif">Kharif</option>
          <option value="Rabi">Rabi</option>
          <option value="Zaid">Zaid</option>
        </select>

        <input
          type="number"
          name="expectedYield"
          placeholder="Expected Yield"
          value={form.expectedYield}
          onChange={handleChange}
        />

        <input
          type="number"
          name="actualYield"
          placeholder="Actual Yield"
          value={form.actualYield}
          onChange={handleChange}
        />

        <input
          type="number"
          name="marketPrice"
          placeholder="Market Price"
          value={form.marketPrice}
          onChange={handleChange}
        />

        <button style={buttonStyle} onClick={addCrop}>
          Add Crop
        </button>
      </div>

      <h3>Total Revenue: ₹ {totalRevenue}</h3>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#2e7d32", color: "white" }}>
            <th>Crop</th>
            <th>Season</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Market Price</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td>{crop.cropName}</td>
              <td>{crop.season}</td>
              <td>{crop.expectedYield}</td>
              <td>{crop.actualYield}</td>
              <td>{crop.marketPrice}</td>
              <td>
                <button
                  style={{ background: "red", color: "white", border: "none" }}
                  onClick={() => deleteCrop(crop.id)}
                >
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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  padding: "8px 14px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginLeft: "10px",
};

export default CropPage;