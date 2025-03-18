import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css";

const StudentHome = () => {
  const [eventItems, setEventItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
  const itemsPerPage = 5;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentName, setStudentName] = useState(""); // State to store student first name
  const [registrationStatus, setRegistrationStatus] = useState(""); // State for registration status
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility

  useEffect(() => {
    // Fetch student first name from localStorage
    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      setStudentName(student.firstName); // Assuming 'firstName' is stored in the user object
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/events/all");
        setEventItems(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < eventItems.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    // Make API call to register for the event
    registerForEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered events based on the search term
  const filteredEvents = eventItems.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to register the student for an event
  const registerForEvent = async (event) => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      if (student) {
        const registrationData = {
          student: { id: student.id }, // Using the student ID here
          event: { eventId: event.eventId }, // Using the event ID here
          registrationTime: new Date().toISOString(), // Current date-time
        };

        const response = await axios.post(
          "http://localhost:8080/registered-events/register",
          registrationData
        );

        if (response.status === 201) {
          setRegistrationStatus("Registration Successful");
          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      console.error("Error registering for the event:", error);
      setRegistrationStatus("Registration Failed");
      setOpenSnackbar(true);
    }
  };

  return (
    <main>
      <header>
        <Navbar />
      </header>
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Welcome {studentName ? `${studentName}` : "Student"}!
        </Typography>

        {/* Search bar */}
        <Box sx={{ marginBottom: 2, width: 500 }}>
          <TextField
            label="Search Events"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {filteredEvents
            .slice(startIndex, startIndex + itemsPerPage)
            .map((event) => (
              <Card key={event.eventId} sx={{ minWidth: 250, maxWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6">{event.eventName}</Typography>
                  <Typography variant="body2">{event.description}</Typography>
                  <br />
                  <Typography variant="body2">
                    <strong>Date & Time:</strong>{" "}
                    {new Date(event.eventDateTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Organizer:</strong> {event.organizer}
                  </Typography>
                  <Typography variant="body2">
                    <strong>City:</strong> {event.city.cityName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {event.category.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => handleCardClick(event)}
                    sx={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Register
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>
      </Box>

      {/* Snackbar for showing registration status */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={
            registrationStatus === "Registration Successful"
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {registrationStatus}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default StudentHome;
