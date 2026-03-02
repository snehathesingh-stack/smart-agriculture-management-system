import React from "react";

function FarmerList({ farmers, openCropPage }) {
  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#2e7d32" }}>🌾 Farmers</h2>

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

export default FarmerList;