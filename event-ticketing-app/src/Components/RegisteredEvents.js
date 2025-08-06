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
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import Navbar from "./Navbar";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      setLoading(true);
      try {
        const apiUrl = "http://localhost:8080/registered-events/all";
        const response = await axios.get(apiUrl);
        const responseData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setEvents(responseData);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();

    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = Array.isArray(events)
    ? events.filter((registration) =>
        registration.event.eventName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDeleteClick = (registrationId) => {
    setDeleteEventId(registrationId);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/registered-events/${deleteEventId}`
      );
      if (response.status === 204) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== deleteEventId)
        );
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const isPastEvent = (eventDateTime) => {
    const eventDate = new Date(eventDateTime);
    const now = new Date();
    return eventDate < now;
  };

  const handleSendReminder = async (registration) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/registered-events/send-reminder",
        registration
      );
      if (response.status === 200) {
        alert("Reminder sent to " + registration.customer.email);
      } else {
        alert("Failed to send reminder.");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Error sending reminder: " + error.message);
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Registered Events", 14, 22);

    const eventData = filteredEvents.map((registration) => ({
      eventName: registration.event.eventName,
      eventDateTime: new Date(
        registration.event.eventDateTime
      ).toLocaleString(),
      category: registration.event.category.name,
      customerName: registration.customer.firstName,
      city: registration.customer.city,
      state: registration.customer.state,
      country: registration.customer.country,
      registrationTime: new Date(
        registration.registrationTime
      ).toLocaleString(),
    }));

    let yPosition = 30;

    eventData.forEach((registration, index) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

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
      doc.text(`Customer Name: ${registration.customerName}`, 14, yPosition);
      yPosition += 6;
      doc.text(`City: ${registration.city}`, 14, yPosition);
      yPosition += 6;
      doc.text(`State: ${registration.state}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Country: ${registration.country}`, 14, yPosition);
      yPosition += 6;
      doc.text(
        `Registration Time: ${registration.registrationTime}`,
        14,
        yPosition
      );
      yPosition += 10;

      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });

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
          {role !== "student" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrint}
              sx={{ alignSelf: "flex-end" }}
            >
              Download Registered Events
            </Button>
          )}
        </Box>

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
                    <strong>Customer Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>City</strong>
                  </TableCell>
                  <TableCell>
                    <strong>State</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Country</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Registration Time</strong>
                  </TableCell>
                  {role === "admin" && (
                    <TableCell>
                      <strong>Actions</strong>
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
                    <TableCell>{registration.customer.firstName}</TableCell>
                    <TableCell>{registration.customer.city}</TableCell>
                    <TableCell>{registration.customer.state}</TableCell>
                    <TableCell>{registration.customer.country}</TableCell>
                    <TableCell>
                      {new Date(registration.registrationTime).toLocaleString()}
                    </TableCell>

                    {role === "admin" && (
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteClick(registration.id)}
                          >
                            Delete
                          </Button>

                          <Tooltip
                            title={
                              isPastEvent(registration.event.eventDateTime)
                                ? "Can't send reminder for past events"
                                : "Send a reminder email"
                            }
                          >
                            <span>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={isPastEvent(
                                  registration.event.eventDateTime
                                )}
                                onClick={() => handleSendReminder(registration)}
                              >
                                Send Reminder
                              </Button>
                            </span>
                          </Tooltip>
                        </Box>
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
