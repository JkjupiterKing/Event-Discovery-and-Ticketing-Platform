import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Basic password strength check
    if (newPassword.length < 8) {
      setSnackbarMessage("Password must be at least 8 characters long.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/users/forgot-password?email=${encodeURIComponent(
          email
        )}&newPassword=${encodeURIComponent(newPassword)}`
      );

      setSnackbarMessage(response.data);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Clear the form fields
      setEmail("");
      setNewPassword("");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      setSnackbarMessage(
        error.response.data.message || "Failed to update password."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px" }}>
        <Typography variant="h5" gutterBottom align="center">
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            helperText="Password must be at least 8 characters long."
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Update Password
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
