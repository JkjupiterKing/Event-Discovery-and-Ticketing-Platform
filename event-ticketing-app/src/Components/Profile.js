import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";

const Profile = () => {
  const [editableUser, setEditableUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Start not editable
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const decodedPassword = user.password ? atob(user.password) : "";
      setEditableUser({ ...user, password: decodedPassword });
      setOriginalUser(user);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const userId = editableUser.id;

    // Compare original user data with the current editable user data
    const hasChanges = Object.keys(editableUser).some(
      (key) => editableUser[key] !== originalUser[key]
    );

    if (!hasChanges) {
      setSnackbarMessage("No changes detected.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/users/${userId}`,
        editableUser
      );

      // Update local storage with updated user details
      localStorage.setItem("user", JSON.stringify(response.data));

      // Update editableUser state with the new data
      setEditableUser(response.data);
      setOriginalUser(response.data);

      setIsEditing(false);
      setSnackbarMessage("Updated successfully!");
      setDialogOpen(true);
    } catch (error) {
      console.error("Error updating user details:", error);
      setSnackbarMessage("Error updating user details.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (!editableUser) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              alt={`${editableUser.firstname} ${editableUser.lastname}`}
              src={editableUser.profilePicture}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Typography variant="h4">{`${editableUser.firstname} ${editableUser.lastname}`}</Typography>
          </Box>
          <Box>
            <TextField
              label="First Name"
              name="firstname"
              value={editableUser.firstname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing} // Disable if not editing
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={editableUser.lastname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing} // Disable if not editing
            />
            <TextField
              label="Email"
              name="email"
              value={editableUser.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing} // Disable if not editing
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={editableUser.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing} // Disable if not editing
            />
          </Box>
          <Box mt={2}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSave}
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)} // Enable editing
              >
                Edit
              </Button>
            )}
          </Box>
        </Paper>
        <br />
        <br />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarMessage.includes("Error") ? "error" : "success"}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Dialog for successful update */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Update Successful</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your profile has been updated successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Profile;
