import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const navigate = useNavigate();

  // Password validation rules
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setDialogTitle("Error");
      setDialogMessage("Please enter a valid email address.");
      setDialogOpen(true);
      return;
    }

    // Validate password rules
    if (!validatePassword(newPassword)) {
      setDialogTitle("Error");
      setDialogMessage(
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character."
      );
      setDialogOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/users/forgot-password?email=${encodeURIComponent(
          email
        )}&newPassword=${encodeURIComponent(newPassword)}`
      );

      // Open dialog for successful update
      setDialogTitle("Success");
      setDialogMessage("Password updated successfully!");
      setDialogOpen(true);

      // Clear the form fields
      setEmail("");
      setNewPassword("");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      // Open dialog for error
      setDialogTitle("Error");
      setDialogMessage(error.response.data.message || "Email not found.");
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
            variant="standard"
            size="small"
          />
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="standard"
            size="small"
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
            helperText="Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character."
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
      </Paper>

      {/* Dialog for success or error messages */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDialog();
              // If the dialog title is "Success", navigate to login
              if (dialogTitle === "Success") {
                navigate("/login");
              }
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ForgotPassword;
