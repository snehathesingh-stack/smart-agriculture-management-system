import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://smart-agriculture-backend-wsh4.onrender.com";

function FarmerPage({ openCropPage }) {
  const [farmers, setFarmers] = useState([]); // ALWAYS array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/farmers`);

      // IMPORTANT: ensure array
      if (Array.isArray(response.data)) {
        setFarmers(response.data);
      } else {
        setFarmers(response.data?.data || []);
      }

    } catch (error) {
      console.error("Error fetching farmers:", error);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading farmers...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#2e7d32" }}>🌾 Farmers</h2>

      {farmers.length === 0 ? (
        <p>No farmers found</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2e7d32", color: "white" }}>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Land Area</th>
              <th>Soil</th>
              <th>Crops</th>
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
                  <button
                    style={buttonStyle}
                    onClick={() => openCropPage(farmer)}
                  >
                    View Crops
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const buttonStyle = {
  padding: "6px 12px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default FarmerPage;