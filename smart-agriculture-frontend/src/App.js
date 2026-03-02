import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
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
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [farmers, setFarmers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    phone: "",
    location: "",
    landArea: "",
    soilType: "",
    cropName: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE =
    "https://smart-agriculture-backend-wsh4.onrender.com";

  useEffect(() => {
    fetchFarmers();
  }, []);

  // ================= FETCH =================
  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/farmers`);
      setFarmers(response.data?.data || []);
      setError("");
    } catch (err) {
      setError("Unable to connect to backend.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      phone: "",
      location: "",
      landArea: "",
      soilType: "",
      cropName: "",
    });
    setIsEditing(false);
  };

  // ================= SAVE =================
  const saveFarmer = async () => {
    try {
      if (
        !form.name ||
        !form.phone ||
        !form.location ||
        !form.landArea ||
        !form.soilType ||
        !form.cropName
      ) {
        alert("Please fill all fields");
        return;
      }

      // ✅ Phone validation moved here
      if (!/^\d{10}$/.test(form.phone)) {
        alert("Phone number must be exactly 10 digits");
        return;
      }

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        landArea: Number(form.landArea),
        soilType: form.soilType,
        cropName: form.cropName,
      };

      if (isEditing) {
        await axios.put(`${API_BASE}/farmers/${form.id}`, payload);
        setSnackMessage("Farmer updated successfully ✅");
      } else {
        await axios.post(`${API_BASE}/farmers`, payload);
        setSnackMessage("Farmer added successfully 🌾");
      }

      setOpenSnack(true);
      fetchFarmers();
      resetForm();
    } catch (error) {
      alert("Operation failed. Check backend or CORS.");
    }
  };

  const editFarmer = (farmer) => {
    setForm(farmer);
    setIsEditing(true);
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_BASE}/farmers/${id}`);
      fetchFarmers();
      setSnackMessage("Farmer deleted ❌");
      setOpenSnack(true);
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#2e7d32" }}>
        🌾 Smart Agriculture Management System
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* ================= FORM ================= */}
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6">
            {isEditing ? "Update Farmer" : "Add Farmer"}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            <TextField
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
            />

            <TextField
              name="phone"
              label="Phone (10 digits)"
              value={form.phone}
              onChange={handleChange}
              inputProps={{ maxLength: 10 }}
              error={form.phone && !/^\d{10}$/.test(form.phone)}
              helperText={
                form.phone && !/^\d{10}$/.test(form.phone)
                  ? "Phone must be exactly 10 digits"
                  : ""
              }
            />

            <TextField
              name="location"
              label="Location"
              value={form.location}
              onChange={handleChange}
            />

            <TextField
              name="landArea"
              label="Land Area"
              type="number"
              value={form.landArea}
              onChange={handleChange}
            />

            {/* Soil Dropdown */}
            <TextField
              select
              name="soilType"
              label="Soil Type"
              value={form.soilType}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Soil</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
            </TextField>

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
            </TextField>
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2e7d32", marginRight: 2 }}
              onClick={saveFarmer}
            >
              {isEditing ? "Update" : "Add"}
            </Button>

            {isEditing && (
              <Button variant="outlined" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ================= TABLE ================= */}
      <Card>
        <CardContent>
          <Typography variant="h6">Farmer List</Typography>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2e7d32" }}>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Phone</TableCell>
                <TableCell sx={{ color: "white" }}>Location</TableCell>
                <TableCell sx={{ color: "white" }}>Land Area</TableCell>
                <TableCell sx={{ color: "white" }}>Soil</TableCell>
                <TableCell sx={{ color: "white" }}>Crop</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
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
                  <TableCell>{farmer.cropName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => editFarmer(farmer)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteFarmer(farmer.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="success">{snackMessage}</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;