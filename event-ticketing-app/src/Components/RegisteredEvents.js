import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]); // Ensure events is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(""); // Role to decide which API to call
  const [openDialog, setOpenDialog] = useState(false); // State for managing the confirmation dialog
  const [deleteEventId, setDeleteEventId] = useState(null); // ID of the event to be deleted

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      setLoading(true);
      try {
        // Get the role from localStorage
        const role = localStorage.getItem("role"); // Assuming the role is stored directly in localStorage
        if (role) {
          setRole(role); // Store the role in state for later use

          let apiUrl = "";
          if (role === "student") {
            // If the role is student, fetch the events for the student
            const student = JSON.parse(localStorage.getItem("student"));
            if (student && student.id) {
              apiUrl = `http://localhost:8080/registered-events/student/${student.id}`;
            }
          } else if (role === "admin") {
            // If the role is admin, fetch all events
            apiUrl = "http://localhost:8080/registered-events/all";
          }

          if (apiUrl) {
            const response = await axios.get(apiUrl);

            // Check if response data is an array or an object and handle accordingly
            const responseData = Array.isArray(response.data)
              ? response.data // If the response is an array, use it directly
              : [response.data]; // If it's a single object, wrap it in an array

            setEvents(responseData); // Set the events state
          }
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []); // Empty dependency array, meaning it will run once when the component mounts

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter events based on search term
  const filteredEvents = Array.isArray(events)
    ? events.filter((registration) =>
        registration.event.eventName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDeleteClick = (registrationId) => {
    // Open the confirmation dialog when delete button is clicked
    setDeleteEventId(registrationId);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      // Call the delete API
      const response = await axios.delete(
        `http://localhost:8080/registered-events/${deleteEventId}`
      );
      if (response.status === 204) {
        // On success, remove the deleted registration from the list
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== deleteEventId)
        );
        setOpenDialog(false); // Close the confirmation dialog
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close the confirmation dialog without deleting
  };

  return (
    <main>
      <header>
        <Navbar />
      </header>
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Registered Events
        </Typography>

        {/* Search bar */}
        <Box sx={{ marginBottom: 2, width: 500 }}>
          <TextField
            label="Search Registered Events"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Table of registered events */}
        {loading ? (
          <Typography>Loading events...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Event Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date & Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Organizer</strong>
                  </TableCell>
                  <TableCell>
                    <strong>City</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Registration Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Student Name</strong>
                  </TableCell>
                  {/* If the role is admin, show a delete column */}
                  {role === "admin" && (
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>{registration.event.eventName}</TableCell>
                    <TableCell>{registration.event.description}</TableCell>
                    <TableCell>
                      {new Date(
                        registration.event.eventDateTime
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{registration.event.organizer}</TableCell>
                    <TableCell>{registration.event.city.cityName}</TableCell>
                    <TableCell>{registration.event.category.name}</TableCell>
                    <TableCell>
                      {new Date(registration.registrationTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{registration.student.firstName}</TableCell>

                    {/* If the role is admin, display a delete button */}
                    {role === "admin" && (
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteClick(registration.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this registration?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </main>
  );
};

export default RegisteredEvents;
