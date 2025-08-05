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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Navbar from "./Navbar";

const API_URL = "http://localhost:8080/events/all";
const ADD_EVENT_API = "http://localhost:8080/events/addEvent";
const UPDATE_EVENT_API = "http://localhost:8080/events";
const DELETE_EVENT_API = "http://localhost:8080/events";
const CATEGORY_API = "http://localhost:8080/categories/all";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    description: "",
    eventDateTime: "",
    organizer: "",
    category: { id: "" },
    capacity: 0,
    registrationFee: 0.0,
    status: "",
    contactEmail: "",
    contactPhone: "",
    result: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const getTodayDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

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
        setSnackbarMessage("Could not fetch categories.");
        setSnackbarOpen(true);
      }
    };
    fetchCategories();
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
      capacity: 0,
      registrationFee: 0.0,
      status: "",
      contactEmail: "",
      contactPhone: "",
      result: "",
    });
    setImageFile(null);
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
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
      !newEvent.registrationFee ||
      !newEvent.result
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

    if (newEvent.capacity < 0 || newEvent.registrationFee < 0) {
      setSnackbarMessage("Capacity and Fee must be non-negative.");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    const eventBlob = new Blob([JSON.stringify(newEvent)], {
      type: "application/json",
    });
    formData.append("event", eventBlob);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editMode) {
        await axios.put(`${UPDATE_EVENT_API}/${editEventId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbarMessage("Event updated successfully!");
      } else {
        await axios.post(ADD_EVENT_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbarMessage("Event added successfully!");
      }

      handleModalClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving event:", error);
      setSnackbarMessage("Could not save event.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (event) => {
    setNewEvent({
      ...event,
      category: {
        id: categories.find((c) => c.name === event.category)?.id || "",
      },
    });
    setEditEventId(event.eventId);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${DELETE_EVENT_API}/${eventToDelete.eventId}`);
      setEvents((prev) =>
        prev.filter((event) => event.eventId !== eventToDelete.eventId)
      );
      setSnackbarMessage("Event deleted successfully!");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      setSnackbarMessage("Could not delete event.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDialogOpen = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
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
                  {event.eventImage && (
                    <Box
                      component="img"
                      src={`data:image/jpeg;base64,${event.eventImage}`}
                      alt="Event"
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                  )}
                  <Typography variant="h6">{event.eventName}</Typography>
                  <Typography variant="body2">{event.description}</Typography>
                  <Typography variant="body2">
                    <strong>Date & Time:</strong>{" "}
                    {event.eventDateTime.replace("T", " ")}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Organizer:</strong> {event.organizer}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {event.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEdit(event)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteDialogOpen(event)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>
        <br />
        {/* Modal for Add/Edit */}
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {editMode ? "Edit Event" : "Create Event"}
            </Typography>
            <Grid container spacing={2}>
              {/* First Column Fields */}
              {[
                { label: "Event Name", name: "eventName", type: "text" },
                { label: "Description", name: "description", type: "text" },
                { label: "Organizer", name: "organizer", type: "text" },
                { label: "Capacity", name: "capacity", type: "number" },
                {
                  label: "Registration Fee",
                  name: "registrationFee",
                  type: "number",
                },
                { label: "Contact Email", name: "contactEmail", type: "email" },
                { label: "Contact Phone", name: "contactPhone", type: "text" },
                { label: "Result", name: "result", type: "text" },
              ].map((field, idx) => (
                <Grid item xs={6} key={idx}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={newEvent[field.name]}
                    onChange={handleInputChange}
                  />
                </Grid>
              ))}

              {/* Datetime Picker with min=Today */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Event Date & Time"
                  name="eventDateTime"
                  type="datetime-local"
                  value={newEvent.eventDateTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDateTimeLocal() }}
                />
              </Grid>

              {/* Status Dropdown */}
              <Grid item xs={6}>
                <FormControl fullWidth>
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

              {/* Category Dropdown */}
              <Grid item xs={6}>
                <FormControl fullWidth>
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

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography>Upload Event Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleModalClose}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {editMode ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete "{eventToDelete?.eventName}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="info"
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Events;
