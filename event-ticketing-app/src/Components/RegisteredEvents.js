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
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
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
        // Fetch all registered events from the API
        const apiUrl = "http://localhost:8080/registered-events/all";
        const response = await axios.get(apiUrl);

        // Check if response data is an array or an object and handle accordingly
        const responseData = Array.isArray(response.data)
          ? response.data // If the response is an array, use it directly
          : [response.data]; // If it's a single object, wrap it in an array

        setEvents(responseData); // Set the events state
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

  // Function to generate PDF and handle print functionality
  const handlePrint = () => {
    const doc = new jsPDF();

    // Set title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Registered Events", 14, 22);

    // Prepare data for transposed table
    const headers = [
      "Event Name",
      "Event Date & Time",
      "Category",
      "Student Name",
    ];
    const data = filteredEvents.map((registration) => [
      registration.event.eventName,
      new Date(registration.event.eventDateTime).toLocaleString(),
      registration.event.category.name,
      registration.student.firstName,
    ]);

    // Set table dimensions
    const startX = 14;
    const startY = 30;
    const rowHeight = 10;
    const columnWidths = [
      60, // Event Name
      60, // Event Date & Time
      40, // Category
      40, // Student Name
    ];

    // Draw table headers
    let xPosition = startX;
    headers.forEach((header, index) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 0, 0); // Black background for header
      doc.rect(
        xPosition,
        startY - rowHeight,
        columnWidths[index],
        rowHeight,
        "F"
      );
      doc.setTextColor(255, 255, 255);
      doc.text(header, xPosition + 2, startY - rowHeight + 6);
      xPosition += columnWidths[index];
    });

    // Draw table rows
    let yPosition = startY;
    data.forEach((row) => {
      xPosition = startX;
      row.forEach((cell, index) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.rect(xPosition, yPosition, columnWidths[index], rowHeight);
        doc.text(cell, xPosition + 2, yPosition + 6);
        xPosition += columnWidths[index];
      });
      yPosition += rowHeight;

      // Add a new page if the content exceeds the page height
      if (yPosition > 260) {
        doc.addPage();
        yPosition = startY;
      }
    });

    // Save the PDF
    doc.save("registered-events.pdf");
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

        {/* Print Button */}
        <Box sx={{ marginBottom: 2 }}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print Events (PDF)
          </Button>
        </Box>

        {/* Table of registered events */}
        {loading ? (
          <Typography>Loading events...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table id="events-table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Event Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Event Date & Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Student Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Branch</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Semester</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Year</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Registration Time</strong>
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
                    <TableCell>
                      {new Date(
                        registration.event.eventDateTime
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{registration.event.category.name}</TableCell>
                    <TableCell>{registration.student.firstName}</TableCell>
                    <TableCell>{registration.student.branch}</TableCell>
                    <TableCell>{registration.student.semester}</TableCell>
                    <TableCell>{registration.student.year}</TableCell>
                    <TableCell>
                      {new Date(registration.registrationTime).toLocaleString()}
                    </TableCell>
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
