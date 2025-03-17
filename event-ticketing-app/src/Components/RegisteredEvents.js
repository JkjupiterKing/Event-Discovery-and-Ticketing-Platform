import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      setLoading(true);
      try {
        const student = JSON.parse(localStorage.getItem("student"));
        if (student) {
          const response = await axios.get(
            `http://localhost:8080/registered-events/student/${student.studentId}`
          );
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <header>
        <Navbar />
      </header>
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Registered Events
        </Typography>

        {/* Search bar */}
        <Box sx={{ marginBottom: 2, width: 500 }}>
          <TextField
            label="Search Registered Events"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Table of registered events */}
        {loading ? (
          <Typography>Loading events...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Event Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date & Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Organizer</strong>
                  </TableCell>
                  <TableCell>
                    <strong>City</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((registration) => (
                  <TableRow key={registration.eventId}>
                    <TableCell>{registration.event.eventName}</TableCell>
                    <TableCell>{registration.event.description}</TableCell>
                    <TableCell>
                      {new Date(
                        registration.event.eventDateTime
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{registration.event.organizer}</TableCell>
                    <TableCell>{registration.event.city.cityName}</TableCell>
                    <TableCell>{registration.event.category.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </main>
  );
};

export default RegisteredEvents;
