import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { jsPDF } from "jspdf";
import axios from "axios";
import Navbar from "./Navbar";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/reminders/all");
        setReminders(response.data);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reminders List", 14, 22);

    let y = 30;
    filteredReminders.forEach((item) => {
      doc.setFontSize(12);
      doc.text(`Customer: ${item.customerName}`, 14, y);
      y += 6;
      doc.text(`Event: ${item.eventName}`, 14, y);
      y += 6;
      const sentAt = new Date(item.sentAt).toLocaleString();
      doc.text(`Sent At: ${sentAt}`, 14, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("reminders.pdf");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredReminders = reminders.filter((reminder) =>
    `${reminder.customerName} ${reminder.eventName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <header>
        <Navbar />
      </header>
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Reminders List
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            label="Search reminders"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
          >
            Download as PDF
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading reminders...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Customer Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Event Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Sent At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReminders.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.eventName}</TableCell>
                    <TableCell>
                      {new Date(item.sentAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReminders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No reminders match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </main>
  );
};

export default Reminders;
