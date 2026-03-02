import React, { useState } from "react";
import { Container, Button, Box } from "@mui/material";
import FarmerPage from "./FarmerPage";
import CropPage from "./CropPage";

function App() {
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [view, setView] = useState("farmers");

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button onClick={() => setView("farmers")} variant="contained" sx={{ mr: 2 }}>
          Farmers
        </Button>
        <Button
          onClick={() => setView("crops")}
          variant="contained"
          disabled={!selectedFarmer}
        >
          Crops
        </Button>
      </Box>

      {view === "farmers" && (
        <FarmerPage
          setSelectedFarmer={setSelectedFarmer}
          setView={setView}
        />
      )}

      {view === "crops" && selectedFarmer && (
        <CropPage farmer={selectedFarmer} />
      )}
    </Container>
  );
}

export default App;