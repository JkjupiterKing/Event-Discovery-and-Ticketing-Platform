import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // Redirect to home page after successful login
      navigate("/home");
    } catch (error) {
      setSnackbarMessage(error.response.data.message || "Login failed");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 3,
          backgroundColor: "#F5F7F8",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "10em" }}
            >
              Login
            </Button>
          </Box>
        </form>

        {/* Forgot Password and Sign Up Links */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" align="center">
            <Link
              href="/forgot-password"
              color="primary"
              style={{ textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography variant="body2" align="center" style={{ marginTop: 8 }}>
            Don't have an account?{" "}
            <Link
              href="/register"
              color="primary"
              style={{ textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;