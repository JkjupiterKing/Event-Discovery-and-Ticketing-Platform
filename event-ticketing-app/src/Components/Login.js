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
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Attempt login with the /users/login endpoint (for admin)
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      // If user is found, store user in local storage with 'admin' role and redirect to /home
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", "admin");

      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      navigate("/home");
    } catch (error) {
      // If user not found at /users/login, attempt to login with /students/Studentlogin (for student)
      try {
        const response = await axios.post(
          "http://localhost:8080/customers/login",
          {
            email,
            password,
          }
        );

        // If student is found, store student in local storage with 'student' role and redirect to /studenthome
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", "student");

        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        navigate("/home");
      } catch (error) {
        // If both login attempts fail, show an error message
        setSnackbarMessage("Invalid email or password.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
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
            variant="standard"
            size="small"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="standard"
            size="small"
            required
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ marginRight: "0.1em" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
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
