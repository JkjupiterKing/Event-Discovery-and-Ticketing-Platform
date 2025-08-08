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
  const [categoryItems, setCategoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [studentName, setStudentName] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("user"));
    if (student) {
      setStudentName(student.firstName);
    }

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
    if (category === "all") {
      setSelectedCategory("all");
    } else {
      setSelectedCategory((prev) =>
        prev === category.name ? "all" : category.name
      );
    }
  };

  const filteredEvents = eventItems.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const registerForEvent = async (event) => {
    try {
      const customer = JSON.parse(localStorage.getItem("user"));
      if (!customer || !customer.id) {
        setRegistrationStatus("Customer not found in localStorage");
        setOpenSnackbar(true);
        return;
      }

      const registrationData = {
        customer: { id: customer.id },
        event: { eventId: event.eventId },
        registrationTime: new Date().toISOString(),
      };

      const registrationResponse = await axios.post(
        "http://localhost:8080/registered-events/register",
        registrationData
      );

      if (registrationResponse.status === 201) {
        setRegistrationStatus("Registration Successful");

        // Trigger recommendation generation
        await axios.post(
          `http://localhost:8080/recommendations/generate/${customer.id}`
        );

        // Send success email
        const successEmailData = {
          customer: {
            email: customer.email,
            firstName: customer.firstName,
          },
          event: {
            eventName: event.eventName,
            eventDateTime: event.eventDateTime,
          },
        };

        await axios.post(
          "http://localhost:8080/registered-events/send-registration-success",
          successEmailData
        );
      } else {
        setRegistrationStatus("Registration Failed");
      }
    } catch (error) {
      console.error("Error registering for the event:", error);
      setRegistrationStatus("Registration Failed");
    } finally {
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
          Welcome {studentName ? `${studentName}` : "user"}!
        </Typography>

        <Box sx={{ marginBottom: 2, width: 500 }}>
          <TextField
            label="Search Events"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <Box
          sx={{ marginBottom: 3, display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          {/* Add "All Events" chip */}
          <Chip
            key="all"
            label="All Events"
            color={selectedCategory === "all" ? "primary" : "default"}
            clickable
            onClick={() => handleCategoryClick("all")}
            sx={{ cursor: "pointer" }}
          />

          {/* Category chips */}
          {categoryItems.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              color={selectedCategory === category.name ? "primary" : "default"}
              clickable
              onClick={() => handleCategoryClick(category)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>

        {filteredEvents.length === 0 ? (
          <Typography variant="h6">
            No events found for the selected category or search term.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredEvents.map((event) => (
              <Card key={event.eventId} sx={{ minWidth: 250, maxWidth: 300 }}>
                <Box
                  sx={{
                    padding: 1,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 180,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64,${event.eventImage}`}
                    alt={event.eventName}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

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
                    <strong>Category:</strong> {event.category}
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
