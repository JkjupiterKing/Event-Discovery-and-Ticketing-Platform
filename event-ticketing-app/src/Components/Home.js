import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Navbar from "./Navbar";
import "./Home.css";

// Sample data for the carousel
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

// Sample data for events
const eventItems = [
  {
    title: "Movie Night: Inception",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Broadway Play: Hamilton",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Concert: Coldplay Live",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Comedy Show: Stand Up Night",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Theater: Romeo and Juliet",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Film Festival: Sundance",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
  {
    title: "Dance Performance: Nutcracker",
    img: `${process.env.PUBLIC_URL}/ticket.gif`,
  },
];

const Home = () => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

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

  return (
    <main>
      {/* Header Start */}
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
      {/* Header End */}

      {/* Carousel Start */}
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
      {/* Carousel End */}

      {/* Fashion Collections Section Start */}
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
            .map((item, index) => (
              <Card key={index} sx={{ maxWidth: 200 }}>
                <CardMedia
                  component="img"
                  alt={item.title}
                  height="200"
                  image={item.img}
                  sx={{ width: "100%" }}
                />
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
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
      {/* Fashion Collections Section End */}
    </main>
  );
};

export default Home;
