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

  const handlePrint = () => {
    const doc = new jsPDF();

    // Set title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Registered Events", 14, 22);

    // Prepare data for display
    const eventData = filteredEvents.map((registration) => ({
      eventName: registration.event.eventName,
      eventDateTime: new Date(
        registration.event.eventDateTime
      ).toLocaleString(),
      category: registration.event.category.name,
      studentName: registration.student.firstName,
      branch: registration.student.branch,
      semester: registration.student.semester,
      year: registration.student.year,
      registrationTime: new Date(
        registration.registrationTime
      ).toLocaleString(),
    }));

    let yPosition = 30; // Start y position for the text

    // Loop through the event data and add it to the document
    eventData.forEach((registration, index) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      // Add event details
      doc.text(`Event Name: ${registration.eventName}`, 14, yPosition);
      yPosition += 6;
      doc.text(
        `Event Date & Time: ${registration.eventDateTime}`,
        14,
        yPosition
      );
      yPosition += 6;
      doc.text(`Category: ${registration.category}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Student Name: ${registration.studentName}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Branch: ${registration.branch}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Semester: ${registration.semester}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Year: ${registration.year}`, 14, yPosition);
      yPosition += 6;
      doc.text(
        `Registration Time: ${registration.registrationTime}`,
        14,
        yPosition
      );
      yPosition += 10; // Add space between events

      // Add a page if the content is too long
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
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

        {/* Search bar and Print button in the same line */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <TextField
            label="Search Registered Events"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 500 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            sx={{ alignSelf: "flex-end" }}
          >
            Download Registered Events
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
