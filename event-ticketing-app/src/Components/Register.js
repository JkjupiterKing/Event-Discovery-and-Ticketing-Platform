import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Container,
  Link,
} from "@mui/material";
import axios from "axios";

const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Password validation rules
  const validatePassword = (password) => {
    const minLength = 8; // Minimum length
    const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
    const hasNumber = /\d/.test(password); // At least one number
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Validate password rules
    if (!validatePassword(password)) {
      setSnackbarMessage(
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          firstname,
          lastname,
          email,
          password,
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Registration successful! You can now log in.");
        setSnackbarSeverity("success");

        // Clear the form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setSnackbarMessage("Registration failed.");
        setSnackbarSeverity("error");
      }
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.response.data.message || "Registration failed");
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
          Register
        </Typography>
        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <TextField
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: 8 }}
          >
            Password must be at least 8 characters long, contain uppercase and
            lowercase letters, a number, and a special character.
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" style={{ marginTop: 16 }}>
          Already have an account?{" "}
          <Link
            href="/login"
            color="primary"
            style={{ textDecoration: "none" }}
          >
            Login
          </Link>
        </Typography>
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

export default Register;