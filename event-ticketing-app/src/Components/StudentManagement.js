// ✅ Imports stay the same (unchanged)
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
  Grid,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Navbar from "./Navbar";
import axios from "axios";
import PropTypes from "prop-types";

// ✅ Pagination logic remains unchanged
const TablePaginationActions = (props) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={(e) =>
          onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "", // ✅ Added phoneNumber
    city: "",
    state: "",
    country: "",
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/customers/all");
      setCustomers(response.data);
    } catch (error) {
      setSnackbarMessage("Error fetching customers.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      phoneNumber,
      city,
      state,
      country,
    } = newCustomer;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !phoneNumber || // ✅ Required validation
      !city ||
      !state ||
      !country
    ) {
      setSnackbarMessage("All fields are required.");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editCustomer) {
        await axios.put(
          `http://localhost:8080/customers/${editCustomer.id}`,
          newCustomer
        );
      } else {
        const response = await axios.post(
          "http://localhost:8080/customers/create",
          newCustomer
        );
        if (response.data === "Email is already in use.") {
          setSnackbarMessage("Email is already in use.");
          setSnackbarOpen(true);
          return;
        }
      }

      setNewCustomer({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        phoneNumber: "",
        city: "",
        state: "",
        country: "",
      });
      setModalOpen(false);
      setEditCustomer(null);
      fetchCustomers();
      setSnackbarMessage(
        editCustomer ? "Customer updated." : "Customer added."
      );
    } catch (error) {
      if (error.response?.data === "Email is already in use.") {
        setSnackbarMessage("Email is already in use.");
      } else {
        setSnackbarMessage("Error adding/updating customer.");
      }
      setSnackbarOpen(true);
    }
  };

  const handleEditCustomer = (customer) => {
    setNewCustomer({ ...customer });
    setEditCustomer(customer);
    setModalOpen(true);
  };

  const handleOpenDeleteConfirmation = (customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCustomer = async () => {
    if (customerToDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/customers/delete/${customerToDelete.id}`
        );
        if (response.status === 200) {
          fetchCustomers();
          setSnackbarMessage("Customer deleted successfully.");
        } else {
          setSnackbarMessage("Error deleting customer.");
        }
      } catch (error) {
        setSnackbarMessage("Error deleting customer.");
      }
      setSnackbarOpen(true);
      setDeleteConfirmationOpen(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) // ✅ Include phone
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "3em" }}>
        <Typography variant="h4" gutterBottom>
          Customer Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1em",
          }}
        >
          <TextField
            label="Search Customers"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "15em" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setModalOpen(true);
              setEditCustomer(null);
              setNewCustomer({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                gender: "",
                phoneNumber: "",
                city: "",
                state: "",
                country: "",
              });
            }}
          >
            Add Customer
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell> {/* ✅ Added */}
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredCustomers.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredCustomers
              ).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell> {/* ✅ */}
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.state}</TableCell>
                  <TableCell>{customer.country}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                      onClick={() => handleEditCustomer(customer)}
                    >
                      Update
                    </Button>
                    <Button
                      color="secondary"
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        marginLeft: "0.3em",
                      }}
                      onClick={() => handleOpenDeleteConfirmation(customer)}
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
                  colSpan={9}
                  count={filteredCustomers.length}
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

        {/* Modal for Add/Edit */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div
            style={{
              padding: 20,
              backgroundColor: "white",
              margin: "100px auto",
              width: "500px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">
              {editCustomer ? "Update Customer" : "Add New Customer"}
            </Typography>
            <Grid container spacing={2}>
              {[
                "firstName",
                "lastName",
                "email",
                "password",
                "gender",
                "phoneNumber", // ✅ Included in form
                "city",
                "state",
                "country",
              ].map((field) => (
                <Grid item xs={6} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    fullWidth
                    variant="standard"
                    type={field === "password" ? "password" : "text"}
                    value={newCustomer[field]}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        [field]: e.target.value,
                      })
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddCustomer}
              sx={{ marginTop: "1em" }}
            >
              {editCustomer ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>

        {/* Modal for Delete Confirmation */}
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
            <Typography variant="h6">
              Are you sure you want to delete this customer?
            </Typography>
            <Box
              sx={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeleteCustomer}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setDeleteConfirmationOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </div>
        </Modal>

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

export default CustomerManagement;
