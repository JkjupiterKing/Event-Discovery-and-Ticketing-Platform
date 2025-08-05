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
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Decode password only if it's encoded and defined
        const decodedPassword =
          user.password && user.password !== ""
            ? (() => {
                try {
                  return atob(user.password);
                } catch {
                  return user.password;
                }
              })()
            : "";
        setEditableUser({ ...user, password: decodedPassword });
        setOriginalUser(user);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        setEditableUser(null);
        setOriginalUser(null);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editableUser || !editableUser.id) {
      setSnackbarMessage("User data is missing. Please login again.");
      setSnackbarOpen(true);
      return;
    }

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
      // Encode password before sending
      const userToUpdate = {
        ...editableUser,
        password:
          editableUser.password && editableUser.password !== ""
            ? btoa(editableUser.password)
            : "",
      };

      const response = await axios.put(
        `http://localhost:8080/users/${editableUser.id}`,
        userToUpdate
      );

      // Update local storage with updated user details
      localStorage.setItem("user", JSON.stringify(response.data));

      // Update editableUser and originalUser states
      const decodedPassword =
        response.data.password && response.data.password !== ""
          ? (() => {
              try {
                return atob(response.data.password);
              } catch {
                return response.data.password;
              }
            })()
          : "";

      setEditableUser({ ...response.data, password: decodedPassword });
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

  if (!editableUser) {
    return (
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Typography variant="h6" color="error">
            No user data found. Please login again.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              alt={`${editableUser.firstname || ""} ${
                editableUser.lastname || ""
              }`}
              src={editableUser.profilePicture || ""}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Typography variant="h4">{`${editableUser.firstname || ""} ${
              editableUser.lastname || ""
            }`}</Typography>
          </Box>
          <Box>
            <TextField
              label="First Name"
              name="firstname"
              value={editableUser.firstname || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={editableUser.lastname || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Email"
              name="email"
              value={editableUser.email || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={editableUser.password || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
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
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </Box>
        </Paper>

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
