import React, { useState } from "react";
import FarmerPage from "./FarmerPage";
import CropPage from "./CropPage";

function App() {
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const openCropPage = (farmer) => {
    setSelectedFarmer(farmer);
  };

  const goBack = () => {
    setSelectedFarmer(null);
  };

  return (
    <div>
      {selectedFarmer ? (
        <>
          <button
            style={{
              margin: "20px",
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={goBack}
          >
            ← Back to Farmers
          </button>

          <CropPage farmer={selectedFarmer} />
        </>
      ) : (
        <FarmerPage openCropPage={openCropPage} />
      )}
    </div>
  );
}

export default App;