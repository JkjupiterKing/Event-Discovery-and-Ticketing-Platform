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
    img: `${process.env.PUBLIC_URL}/Movies.jpg`,
    title: "Cinema Under the Stars",
    description:
      "Join us for an unforgettable outdoor movie experience featuring classic and contemporary films. Enjoy a cozy atmosphere with friends and family, along with delicious snacks under the starry sky.",
  },
  {
    img: `${process.env.PUBLIC_URL}/Plays.jpg`,
    title: "Theater of Dreams",
    description:
      "Immerse yourself in captivating performances with our selection of theatrical productions. From timeless classics to modern masterpieces, experience the magic of live theater with talented actors on stage.",
  },
  {
    img: `${process.env.PUBLIC_URL}/Events.jpg`,
    title: "Community Connect",
    description:
      "Be a part of our vibrant community events, where connections are made and memories are created. Join us for workshops, festivals, and gatherings that celebrate culture, creativity, and togetherness.",
  },
  {
    img: `${process.env.PUBLIC_URL}/Activities.jpg`,
    title: "Adventure Awaits",
    description:
      "Explore exciting activities for all ages, from thrilling outdoor adventures to creative workshops. Whether you're seeking adrenaline or artistry, there's something for everyone to enjoy!",
  },
  {
    img: `${process.env.PUBLIC_URL}/Sports.jpg`,
    title: "Game On!",
    description:
      "Get ready for action-packed sports events featuring local teams and thrilling competitions. Cheer for your favorites and experience the excitement of live sports, from football to basketball and more!",
  },
];

const Home = () => {
  const [eventItems, setEventItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
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
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <main>
      <header>
        <Navbar />
      </header>

      <Box sx={{ padding: 2 }}>
        <Carousel
          autoPlay
          interval={5000}
          indicators={true}
          navButtonsAlwaysVisible={true}
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
                alt={item.title} // Accessibility improvement
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

      <Box sx={{ padding: 2, backgroundColor: "#181C14", color: "white" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          All Events
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={2}
        >
          {eventItems
            .slice(startIndex, startIndex + itemsPerPage)
            .map((item) => (
              <Card
                key={item.eventId}
                sx={{ maxWidth: 200, cursor: "pointer" }}
                onClick={() => handleCardClick(item)}
              >
                <CardMedia
                  component="img"
                  alt={item.eventName}
                  height="200"
                  image={item.img} // Assuming your API returns an image URL
                  sx={{ width: "100%" }}
                />
                <CardContent>
                  <Typography variant="h6">{item.eventName}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="body2">{item.city.cityName}</Typography>
                </CardContent>
              </Card>
            ))}
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
            disabled={startIndex + itemsPerPage >= eventItems.length}
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
      <br />

      {/* Modal for Event Details */}
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
              <Typography variant="h5">{selectedEvent.eventName}</Typography>
              <Typography variant="subtitle1">
                {selectedEvent.description}
              </Typography>
              <Typography variant="body1">
                <strong>Date & Time:</strong>{" "}
                {new Date(selectedEvent.eventDateTime).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedEvent.city.cityName}
              </Typography>
              <Typography variant="body1">
                <strong>Organizer:</strong> {selectedEvent.organizer}
              </Typography>
              <Typography variant="body1">
                <strong>Capacity:</strong> {selectedEvent.capacity}
              </Typography>
              <Typography variant="body1">
                <strong>Registration Fee:</strong> $
                {selectedEvent.registrationFee}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedEvent.status}
              </Typography>
              <Typography variant="body1">
                <strong>Contact Email:</strong> {selectedEvent.contactEmail}
              </Typography>
              <Typography variant="body1">
                <strong>Contact Phone:</strong> {selectedEvent.contactPhone}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </main>
  );
};

export default Home;
