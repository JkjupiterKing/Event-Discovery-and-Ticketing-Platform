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
    img: "https://assets-in.bmscdn.com/promotions/cms/creatives/1727851263413_techroastshowweb.jpg",
    alt: "Tech Roast Show",
  },
  {
    img: "https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg",
    alt: "Play Card",
  },
  {
    img: "https://assets-in.bmscdn.com/promotions/cms/creatives/1727710500223_lollapaloozaindia2025web.jpg",
    alt: "Lollapalooza India 2025",
  },
  {
    img: "https://assets-in.bmscdn.com/promotions/cms/creatives/1727713083120_sunidhiweb.jpg",
    alt: "Sunidhi Chauhan Concert",
  },
];

const Home = () => {
  const [eventItems, setEventItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event

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
    setSelectedEvent(event); // Set selected event to show details
  };

  const handleCloseModal = () => {
    setSelectedEvent(null); // Close modal
  };

  return (
    <main>
      <header>
        <Navbar />
        <img
          src="images/bars.svg"
          alt="Open Menu"
          id="menu_toggle"
          onClick={() => {
            const header = document.querySelector("header");
            header.classList.toggle("showMenu");
          }}
        />
      </header>

      <Box sx={{ padding: 2 }}>
        <Carousel
          autoPlay
          interval={5000}
          indicators={true}
          navButtonsAlwaysVisible={true}
          cycleNavigation
        >
          {items.map((item, index) => (
            <a
              href={item.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box
                component="img"
                src={item.img}
                alt={item.alt}
                sx={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "auto",
                }}
              />
            </a>
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
                <strong>Location:</strong> {selectedEvent.location}
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
