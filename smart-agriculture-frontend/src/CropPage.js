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

  const fetchCrops = async () => {
    const res = await API.get(`/farmers/${farmer.id}/crops`);
    setCrops(res.data);
  };

  const fetchRevenue = async () => {
    const res = await API.get(`/farmers/${farmer.id}/crops/revenue`);
    setRevenue(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCrop = async () => {
    await API.post(`/farmers/${farmer.id}/crops`, {
      ...form,
      expectedYield: Number(form.expectedYield),
      actualYield: Number(form.actualYield),
      marketPrice: Number(form.marketPrice),
    });

    fetchCrops();
    fetchRevenue();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Crops of {farmer.name}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField select name="cropName" label="Crop"
              value={form.cropName} onChange={handleChange}
              SelectProps={{ native: true }}>
              <option value="">Select Crop</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
            </TextField>

            <TextField name="season" label="Season" value={form.season} onChange={handleChange} />
            <TextField name="expectedYield" label="Expected Yield" type="number" value={form.expectedYield} onChange={handleChange} />
            <TextField name="actualYield" label="Actual Yield" type="number" value={form.actualYield} onChange={handleChange} />
            <TextField name="marketPrice" label="Market Price" type="number" value={form.marketPrice} onChange={handleChange} />

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
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crops.map((crop) => (
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