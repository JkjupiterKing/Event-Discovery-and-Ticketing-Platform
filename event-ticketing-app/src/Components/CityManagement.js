import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Typography,
  Snackbar,
  TableFooter,
  TablePagination,
  Box,
  IconButton,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Navbar from "./Navbar";
import axios from "axios";
import PropTypes from "prop-types";

const TablePaginationActions = (props) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCity, setNewCity] = useState({
    cityName: "",
    stateName: "",
    countryName: "",
  });
  const [editCity, setEditCity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  // Fetch cities from the API
  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cities/all");
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSnackbarMessage("Error fetching cities.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleAddCity = async () => {
    if (!newCity.cityName || !newCity.stateName || !newCity.countryName) {
      setSnackbarMessage("Enter City name, State, and Country");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editCity) {
        await axios.put(`http://localhost:8080/cities/${editCity.cityid}`, {
          cityName: newCity.cityName,
          stateName: newCity.stateName,
          countryName: newCity.countryName,
        });
      } else {
        await axios.post("http://localhost:8080/cities/addCity", newCity);
      }
      setNewCity({ cityName: "", stateName: "", countryName: "" });
      setModalOpen(false);
      setEditCity(null);
      fetchCities();
      setSnackbarMessage(
        editCity ? "City updated successfully." : "City added successfully."
      );
    } catch (error) {
      console.error("Error adding/updating city:", error);
      setSnackbarMessage("Error adding/updating city.");
    }
    setSnackbarOpen(true);
  };

  const handleEditCity = (city) => {
    setNewCity({
      cityName: city.cityName,
      stateName: city.stateName,
      countryName: city.countryName,
    });
    setEditCity(city);
    setModalOpen(true);
  };

  const handleOpenDeleteConfirmation = (city) => {
    setCityToDelete(city);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCity = async () => {
    if (cityToDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/cities/${cityToDelete.cityid}`
        );
        fetchCities();
        setSnackbarMessage("City deleted successfully.");
      } catch (error) {
        console.error("Error deleting city:", error);
        setSnackbarMessage("Error deleting city.");
      }
      setDeleteConfirmationOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredCities = cities.filter(
    (city) =>
      city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "3em" }}>
        <Typography variant="h4" gutterBottom>
          City Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1em",
          }}
        >
          <TextField
            label="Search Cities"
            variant="outlined"
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "15em" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setModalOpen(true);
              setEditCity(null);
              setNewCity({ cityName: "", stateName: "", countryName: "" });
            }}
          >
            Add City
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>City Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredCities.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredCities
              ).map((city) => (
                <TableRow key={city.cityid}>
                  <TableCell>{city.cityName}</TableCell>
                  <TableCell>{city.stateName}</TableCell>
                  <TableCell>{city.countryName}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEditCity(city)}
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleOpenDeleteConfirmation(city)}
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        marginLeft: "0.3em",
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={4}
                  count={filteredCities.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Modal for adding/updating a city */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div
            style={{
              padding: 20,
              backgroundColor: "white",
              margin: "100px auto",
              width: "400px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">
              {editCity ? "Update City" : "Add New City"}
            </Typography>
            <TextField
              label="City Name"
              fullWidth
              margin="normal"
              variant="standard"
              value={newCity.cityName}
              onChange={(e) =>
                setNewCity({ ...newCity, cityName: e.target.value })
              }
            />
            <TextField
              label="State"
              fullWidth
              margin="normal"
              variant="standard"
              value={newCity.stateName}
              onChange={(e) =>
                setNewCity({ ...newCity, stateName: e.target.value })
              }
            />
            <TextField
              label="Country"
              fullWidth
              margin="normal"
              variant="standard"
              value={newCity.countryName}
              onChange={(e) =>
                setNewCity({ ...newCity, countryName: e.target.value })
              }
            />
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddCity}
            >
              {editCity ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>

        {/* Confirmation Modal for deleting a city */}
        <Modal
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
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
            <Typography>Are you sure you want to delete this City?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1em",
              }}
            >
              <Button
                onClick={() => setDeleteConfirmationOpen(false)}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCity}
                variant="contained"
                color="secondary"
                sx={{ marginLeft: "0.5em" }}
              >
                Confirm
              </Button>
            </Box>
          </div>
        </Modal>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </div>
    </>
  );
};

export default CityManagement;
