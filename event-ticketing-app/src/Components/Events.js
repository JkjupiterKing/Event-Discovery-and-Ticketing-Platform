import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Modal,
  InputAdornment,
} from "@mui/material";
import Navbar from "./Navbar";

// Sample event data
const sampleEvents = [
  {
    id: 1,
    title: "Concert in the Park",
    date: "2023-10-10",
    image: `${process.env.PUBLIC_URL}/concert.jpg`,
  },
  {
    id: 2,
    title: "Art Exhibition",
    date: "2023-11-15",
    image: `${process.env.PUBLIC_URL}/art-exhibit.jpg`,
  },
  {
    id: 3,
    title: "Food Festival",
    date: "2023-12-01",
    image: `${process.env.PUBLIC_URL}/food-festival.jpg`,
  },
  {
    id: 4,
    title: "Outdoor Activities",
    date: "2023-11-05",
    image: `${process.env.PUBLIC_URL}/activities.jpg`,
  },
  {
    id: 5,
    title: "Comedy Show",
    date: "2023-11-12",
    image: `${process.env.PUBLIC_URL}/comedy.jpg`,
  },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(sampleEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", image: "" });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setNewEvent({ title: "", date: "", image: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newId = events.length + 1;
    setEvents((prev) => [...prev, { ...newEvent, id: newId }]);
    handleModalClose();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            size="small"
            placeholder="Search for Events,Plays,Sports and Activities"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
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
        <br />
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {event.date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <br />
      {/* Modal for creating an event */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            mx: "auto",
            mt: "15%",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Create New Event
          </Typography>
          <TextField
            label="Event Title"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Date"
            name="date"
            type="date"
            value={newEvent.date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Event Image URL"
            name="image"
            value={newEvent.image}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleModalClose}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Events;
