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
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/farmers/${farmer.id}/crops`
      );
      setCrops(response.data || []);
    } catch (error) {
      console.error(error);
      setCrops([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCrop = async () => {
    try {
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
    } catch (error) {
      console.error(error);
      alert("Error adding crop");
    }
  };

  const totalRevenue = crops.reduce(
    (sum, crop) => sum + crop.actualYield * crop.marketPrice,
    0
  );

  return (
    <div>
      <h2>Crops of {farmer.name}</h2>

      {/* Form */}
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

      <button onClick={addCrop}>Add Crop</button>

      <h3>Total Revenue: ₹ {totalRevenue}</h3>

      {/* Table */}
      {crops.length === 0 ? (
        <p>No crops found</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Season</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Market Price</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CropPage;