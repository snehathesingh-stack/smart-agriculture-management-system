import React, { useEffect, useState } from "react";
import { API } from "./api";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

function CropPage({ farmer }) {
  const [crops, setCrops] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [form, setForm] = useState({
    cropName: "",
    season: "",
    expectedYield: "",
    actualYield: "",
    marketPrice: "",
  });

  useEffect(() => {
    fetchCrops();
    fetchRevenue();
  }, []);

  // ✅ FIXED FETCH (handles ApiResponse)
  const fetchCrops = async () => {
    try {
      const res = await API.get(`/farmers/${farmer.id}/crops`);

      if (Array.isArray(res.data.data)) {
        setCrops(res.data.data);
      } else if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops([]);
      }
    } catch {
      setCrops([]);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await API.get(
        `/farmers/${farmer.id}/crops/revenue`
      );

      if (res.data.data !== undefined) {
        setRevenue(res.data.data);
      } else {
        setRevenue(res.data);
      }
    } catch {
      setRevenue(0);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCrop = async () => {
    try {
      await API.post(`/farmers/${farmer.id}/crops`, {
        ...form,
        expectedYield: Number(form.expectedYield),
        actualYield: Number(form.actualYield),
        marketPrice: Number(form.marketPrice),
      });

      fetchCrops();
      fetchRevenue();

      setForm({
        cropName: "",
        season: "",
        expectedYield: "",
        actualYield: "",
        marketPrice: "",
      });
    } catch {
      alert("Failed to add crop");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Crops of {farmer.name}
      </Typography>

      {/* FORM */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">

            {/* Crop Dropdown */}
            <TextField
              select
              name="cropName"
              label="Crop"
              value={form.cropName}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Crop</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Maize">Maize</option>
            </TextField>

            {/* Season Dropdown */}
            <TextField
              select
              name="season"
              label="Season"
              value={form.season}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Season</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </TextField>

            <TextField
              name="expectedYield"
              label="Expected Yield"
              type="number"
              value={form.expectedYield}
              onChange={handleChange}
            />

            <TextField
              name="actualYield"
              label="Actual Yield"
              type="number"
              value={form.actualYield}
              onChange={handleChange}
            />

            <TextField
              name="marketPrice"
              label="Market Price"
              type="number"
              value={form.marketPrice}
              onChange={handleChange}
            />

            <Button variant="contained" onClick={addCrop}>
              Add Crop
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* REVENUE */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Revenue: ₹ {revenue}
      </Typography>

      {/* TABLE */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Crop</TableCell>
            <TableCell>Season</TableCell>
            <TableCell>Expected</TableCell>
            <TableCell>Actual</TableCell>
            <TableCell>Market Price</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.isArray(crops) &&
            crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.cropName}</TableCell>
                <TableCell>{crop.season}</TableCell>
                <TableCell>{crop.expectedYield}</TableCell>
                <TableCell>{crop.actualYield}</TableCell>
                <TableCell>{crop.marketPrice}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

export default CropPage;