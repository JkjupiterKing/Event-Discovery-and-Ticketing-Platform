import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  FormControl,
  Button,
  Typography,
  Box,
  Modal,
  Grid,
  InputAdornment,
  Snackbar,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Navbar from "./Navbar";

const API_URL = "http://localhost:8080/events/all";
const ADD_EVENT_API = "http://localhost:8080/events/addEvent";
const UPDATE_EVENT_API = "http://localhost:8080/events";
const DELETE_EVENT_API = "http://localhost:8080/events";
const CATEGORY_API = "http://localhost:8080/categories/all";
const CITY_API = "http://localhost:8080/cities/all";

const statusOptions = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    description: "",
    eventDateTime: "",
    organizer: "",
    category: { id: "" },
    city: { cityid: "" }, // Ensure city is initialized
    capacity: 0,
    registrationFee: 0.0,
    status: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setSnackbarMessage("Could not fetch events. Please try again later.");
        setSnackbarOpen(true);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_API);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSnackbarMessage(
          "Could not fetch categories. Please try again later."
        );
        setSnackbarOpen(true);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(CITY_API);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setSnackbarMessage("Could not fetch cities. Please try again later.");
        setSnackbarOpen(true);
      }
    };
    fetchCities();
  }, []);

  const handleCreateEvent = () => {
    setModalOpen(true);
    setEditMode(false);
    resetEventForm();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    resetEventForm();
  };

  const resetEventForm = () => {
    setNewEvent({
      eventName: "",
      description: "",
      eventDateTime: "",
      organizer: "",
      category: { id: "" },
      city: { cityid: "" }, // Reset city to ensure it's initialized
      capacity: 0,
      registrationFee: 0.0,
      status: "",
      contactEmail: "",
      contactPhone: "",
    });
    setEditEventId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setNewEvent((prev) => ({ ...prev, category: { id: selectedCategoryId } }));
  };

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    const selectedCity = cities.find((city) => city.cityid === selectedCityId);
    setNewEvent((prev) => ({
      ...prev,
      city: selectedCity ? { cityid: selectedCity.cityid } : { cityid: "" }, // Ensure city is always defined
    }));
  };

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    // Form validation
    if (
      !newEvent.eventName ||
      !newEvent.category.id ||
      !newEvent.description ||
      !newEvent.eventDateTime ||
      !newEvent.organizer ||
      !newEvent.contactEmail ||
      !newEvent.contactPhone ||
      !newEvent.status ||
      !newEvent.capacity ||
      !newEvent.registrationFee
    ) {
      setSnackbarMessage("All fields are required.");
      setSnackbarOpen(true);
      return;
    }
    if (!isEmailValid(newEvent.contactEmail)) {
      setSnackbarMessage("A valid Contact Email is required.");
      setSnackbarOpen(true);
      return;
    }
    if (newEvent.capacity < 0) {
      setSnackbarMessage("Capacity cannot be negative.");
      setSnackbarOpen(true);
      return;
    }

    if (newEvent.registrationFee < 0) {
      setSnackbarMessage("Registration Fee cannot be negative.");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${UPDATE_EVENT_API}/${editEventId}`, newEvent);
        setSnackbarMessage("Event updated successfully!");
        setEvents((prev) =>
          prev.map((event) =>
            event.eventId === editEventId
              ? { ...newEvent, eventId: editEventId }
              : event
          )
        );
        window.location.reload();
      } else {
        const response = await axios.post(ADD_EVENT_API, newEvent);
        setSnackbarMessage("Event added successfully!");
        setEvents((prev) => [...prev, response.data]);
        window.location.reload();
      }
      handleModalClose();
    } catch (error) {
      console.error("Error saving event:", error);
      setSnackbarMessage("Could not save event. Please try again later.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (event) => {
    setNewEvent({ ...event, city: { cityid: event.city.cityid } });
    setEditEventId(event.eventId);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteEventId(id);
    setConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${DELETE_EVENT_API}/${deleteEventId}`);
      setEvents((prev) =>
        prev.filter((event) => event.eventId !== deleteEventId)
      );
      setSnackbarMessage("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      setSnackbarMessage("Could not delete event. Please try again later.");
    } finally {
      setConfirmationOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <Typography variant="h4" gutterBottom sx={{ ml: 8 }}>
        Event Management
      </Typography>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            size="small"
            placeholder="Search for Events"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "30em", mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateEvent}
          >
            Create Event
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {events
            .filter((event) =>
              event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
            )
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
                    onClick={() => handleEdit(event)}
                    sx={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Update
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(event.eventId)}
                    sx={{
                      ml: 1,
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>
      </Container>
      {/* Modal for adding/updating an event */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div
          style={{
            padding: 20,
            backgroundColor: "white",
            margin: "100px auto",
            width: "600px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">
            {editMode ? "Update Event" : "Add New Event"}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ marginTop: "1em" }}>
              <TextField
                label="Event Name"
                value={newEvent.eventName}
                size="small"
                variant="outlined"
                name="eventName"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sx={{ marginTop: "1em" }}>
              <TextField
                label="Description"
                value={newEvent.description}
                size="small"
                variant="outlined"
                name="description"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography>Event Date and Time</Typography>
              <TextField
                type="datetime-local"
                value={newEvent.eventDateTime}
                name="eventDateTime"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sx={{ marginTop: "1em" }}>
              <TextField
                label="Organizer"
                value={newEvent.organizer}
                size="small"
                variant="outlined"
                name="organizer"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Typography>Category</Typography>
                <Select
                  value={newEvent.category.id}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Typography>City</Typography>
                <Select
                  value={newEvent.city.cityid}
                  onChange={handleCityChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.cityid} value={city.cityid}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sx={{ marginTop: "1em" }}>
              <TextField
                label="Capacity"
                type="number"
                value={newEvent.capacity}
                size="small"
                variant="outlined"
                name="capacity"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sx={{ marginTop: "1em" }}>
              <TextField
                label="Registration Fee"
                type="number"
                value={newEvent.registrationFee}
                size="small"
                variant="outlined"
                name="registrationFee"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Typography>Status</Typography>
                <Select
                  name="status"
                  value={newEvent.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Contact Email"
                value={newEvent.contactEmail}
                size="small"
                variant="outlined"
                name="contactEmail"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Contact Phone"
                value={newEvent.contactPhone}
                size="small"
                variant="outlined"
                name="contactPhone"
                fullWidth
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            style={{ marginTop: "16px" }}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </div>
      </Modal>
      <Modal open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <div
          style={{
            padding: 20,
            backgroundColor: "white",
            margin: "100px auto",
            width: "400px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography>Are you sure you want to delete this event?</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1em",
            }}
          >
            <Button onClick={() => setConfirmationOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
              sx={{ marginLeft: "0.5em" }}
            >
              Confirm
            </Button>
          </Box>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          color: "white",
          width: "auto",
        }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Events;
