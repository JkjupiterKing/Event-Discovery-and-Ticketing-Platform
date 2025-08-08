import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css";
import CloseIcon from "@mui/icons-material/Close";

const items = [
  {
    img: `${process.env.PUBLIC_URL}/Event1.png`,
    title: "JSS Polytechnic Sports",
    description:
      "Get ready for action-packed sports events featuring local teams and thrilling competitions.",
  },
  {
    img: `${process.env.PUBLIC_URL}/Activities.jpg`,
    title: "JSS Polytechnic Cultural Events",
    description:
      "Join our vibrant cultural events with workshops, festivals, and creative experiences.",
  },
];

// Utility to safely render strings or fallback to JSON string if it's an object
const safeRender = (field) => {
  if (field === null || field === undefined) return "N/A";
  return typeof field === "string" ? field : JSON.stringify(field);
};

const Home = () => {
  const [eventItems, setEventItems] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(storedRole);

    if (storedRole === "student" && user?.id) {
      fetchRecommendations(user.id);
    }

    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/events/all");
      setEventItems(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRecommendations = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/recommendations/customer/${customerId}`
      );
      setRecommendedEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching recommended events:", error);
    }
  };

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
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    return dateTimeStr.replace("T", " ");
  };

  const filteredAllEvents =
    role === "student"
      ? eventItems.filter(
          (event) =>
            !recommendedEvents.some((rec) => rec.eventId === event.eventId)
        )
      : eventItems;

  const renderEventCard = (item) => (
    <Card key={item.eventId} sx={{ maxWidth: 220 }}>
      <Box
        sx={{
          padding: 1,
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <CardMedia
          component="img"
          alt={safeRender(item.eventName)}
          image={`data:image/jpeg;base64,${item.eventImage}`}
          sx={{
            maxHeight: "100%",
            maxWidth: "100%",
            borderRadius: 1,
            objectFit: "contain",
          }}
        />
      </Box>
      <CardContent>
        <Typography variant="h6">{safeRender(item.eventName)}</Typography>
        <Typography variant="body2" noWrap>
          {safeRender(item.description)}
        </Typography>
        {/* Display only category name */}
        <Typography variant="body2">{item.category?.name || "N/A"}</Typography>
      </CardContent>
      <Box textAlign="center" sx={{ paddingBottom: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleCardClick(item)}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );

  return (
    <main>
      <header>
        <Navbar />
      </header>

      {/* Carousel Section */}
      <Box sx={{ padding: 2 }}>
        <Carousel
          autoPlay
          interval={5000}
          indicators
          navButtonsAlwaysVisible
          cycleNavigation
          sx={{ height: 300 }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={item.img}
                alt={item.title}
                sx={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 1,
                  borderRadius: 1,
                  maxWidth: "80%",
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2">{item.description}</Typography>
              </Box>
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Recommended Section (Only for students) */}
      {role === "student" && (
        <Box sx={{ padding: 2, backgroundColor: "#0F1110", color: "white" }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Recommended For You
          </Typography>
          {recommendedEvents.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
              gap={2}
            >
              {recommendedEvents.map(renderEventCard)}
            </Box>
          ) : (
            <Typography variant="body1">
              No recommendations available.
            </Typography>
          )}
        </Box>
      )}

      {/* All Events Section - Hidden for Students */}
      {role !== "student" && (
        <Box sx={{ padding: 2, backgroundColor: "#181C14", color: "white" }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            All Events
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
            gap={2}
          >
            {filteredAllEvents
              .slice(startIndex, startIndex + itemsPerPage)
              .map(renderEventCard)}
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginTop: 2 }}
          >
            <Button
              variant="contained"
              onClick={handlePrev}
              disabled={startIndex === 0}
              style={{
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
              }}
            >
              &lt;
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= filteredAllEvents.length}
              style={{
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
              }}
            >
              &gt;
            </Button>
          </Box>
        </Box>
      )}

      {/* Event Details Modal */}
      <Modal
        open={Boolean(selectedEvent)}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            width: "80%",
            maxWidth: 500,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedEvent && (
            <>
              <Typography variant="h5" gutterBottom>
                {safeRender(selectedEvent.eventName)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {safeRender(selectedEvent.description)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date & Time:</strong>{" "}
                {formatDateTime(selectedEvent.eventDateTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Category:</strong>{" "}
                {selectedEvent.category?.name || "N/A"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Organizer:</strong>{" "}
                {safeRender(selectedEvent.organizer)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Capacity:</strong> {safeRender(selectedEvent.capacity)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Registration Fee:</strong> $
                {safeRender(selectedEvent.registrationFee)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {safeRender(selectedEvent.status)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Contact Email:</strong>{" "}
                {safeRender(selectedEvent.contactEmail)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Contact Phone:</strong>{" "}
                {safeRender(selectedEvent.contactPhone)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Result:</strong>{" "}
                {safeRender(selectedEvent.result || "NA")}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </main>
  );
};

export default Home;
