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
  Chip,
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css";

const StudentHome = () => {
  const [eventItems, setEventItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]); // State to store categories
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store selected category
  const [studentName, setStudentName] = useState(""); // State to store student first name
  const [registrationStatus, setRegistrationStatus] = useState(""); // State for registration status
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility

  useEffect(() => {
    // Fetch student first name from localStorage
    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      setStudentName(student.firstName); // Assuming 'firstName' is stored in the user object
    }

    // Fetch categories and events
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/categories/all"
        );
        setCategoryItems(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/events/all");
        setEventItems(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchCategories();
    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // If same category is clicked again, deselect it
    } else {
      setSelectedCategory(category); // Set selected category
    }
  };

  // Filtered events based on search term and selected category
  const filteredEvents = eventItems.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.category.name === selectedCategory.name;
    return matchesSearch && matchesCategory;
  });

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

        {/* Category Blocks */}
        <Box
          sx={{ marginBottom: 3, display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          {categoryItems.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              color={selectedCategory === category ? "primary" : "default"}
              clickable
              onClick={() => handleCategoryClick(category)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>

        {/* Display message if no events are found */}
        {filteredEvents.length === 0 ? (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            No events found for the selected category or search term.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredEvents.map((event) => (
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
                    <strong>Category:</strong> {event.category.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => registerForEvent(event)}
                    sx={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Register
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
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
