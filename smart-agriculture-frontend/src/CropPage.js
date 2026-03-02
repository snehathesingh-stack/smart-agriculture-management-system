import React, { useEffect, useState } from "react";
import axios from "axios";
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

const API_BASE =
  "https://smart-agriculture-backend-wsh4.onrender.com";

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
  }, [farmer]);

  const fetchCrops = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/farmers/${farmer.id}/crops`
      );

      setCrops(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(err);
      setCrops([]);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/farmers/${farmer.id}/crops/revenue`
      );

      setRevenue(res.data);

    } catch (err) {
      console.error(err);
      setRevenue(0);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCrop = async () => {
    if (
      !form.cropName ||
      !form.season ||
      !form.expectedYield ||
      !form.actualYield ||
      !form.marketPrice
    ) {
      alert("Fill all fields");
      return;
    }

    await axios.post(
      `${API_BASE}/farmers/${farmer.id}/crops`,
      {
        cropName: form.cropName,
        season: form.season,
        expectedYield: Number(form.expectedYield),
        actualYield: Number(form.actualYield),
        marketPrice: Number(form.marketPrice),
      }
    );

    fetchCrops();
    fetchRevenue();

    setForm({
      cropName: "",
      season: "",
      expectedYield: "",
      actualYield: "",
      marketPrice: "",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Crops of {farmer.name}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">

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
            </TextField>

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

      <Typography variant="h6">
        Total Revenue: ₹ {revenue}
      </Typography>

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
          {crops.length > 0 ? (
            crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.cropName}</TableCell>
                <TableCell>{crop.season}</TableCell>
                <TableCell>{crop.expectedYield}</TableCell>
                <TableCell>{crop.actualYield}</TableCell>
                <TableCell>{crop.marketPrice}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No crops found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default CropPage;