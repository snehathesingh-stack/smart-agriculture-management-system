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

function FarmerPage({ setSelectedFarmer, setView }) {
  const [farmers, setFarmers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    landArea: "",
    soilType: "",
  });

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    const res = await API.get("/farmers");
    setFarmers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFarmer = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be exactly 10 digits");
      return;
    }

    await API.post("/farmers", {
      ...form,
      landArea: Number(form.landArea),
    });

    fetchFarmers();
    setForm({
      name: "",
      phone: "",
      location: "",
      landArea: "",
      soilType: "",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Farmer Management
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} />
            <TextField name="phone" label="Phone (10 digits)" value={form.phone} onChange={handleChange} />
            <TextField name="location" label="Location" value={form.location} onChange={handleChange} />
            <TextField name="landArea" label="Land Area" type="number" value={form.landArea} onChange={handleChange} />

            <TextField select name="soilType" label="Soil" value={form.soilType}
              onChange={handleChange} SelectProps={{ native: true }}>
              <option value="">Select Soil</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
            </TextField>

            <Button variant="contained" onClick={addFarmer}>
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Land</TableCell>
            <TableCell>Soil</TableCell>
            <TableCell>Manage Crops</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {farmers.map((farmer) => (
            <TableRow key={farmer.id}>
              <TableCell>{farmer.name}</TableCell>
              <TableCell>{farmer.phone}</TableCell>
              <TableCell>{farmer.location}</TableCell>
              <TableCell>{farmer.landArea}</TableCell>
              <TableCell>{farmer.soilType}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedFarmer(farmer);
                    setView("crops");
                  }}
                >
                  Manage Crops
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default FarmerPage;