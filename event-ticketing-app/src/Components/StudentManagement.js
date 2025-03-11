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

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [editStudent, setEditStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students/all");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setSnackbarMessage("Error fetching students.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (
      !newStudent.firstName ||
      !newStudent.lastName ||
      !newStudent.email ||
      !newStudent.password
    ) {
      setSnackbarMessage("Enter First Name, Last Name, Email, and Password");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editStudent) {
        await axios.put(`http://localhost:8080/students/${editStudent.id}`, {
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          email: newStudent.email,
          password: newStudent.password,
        });
      } else {
        const response = await axios.post(
          "http://localhost:8080/students/create",
          newStudent
        );
        // Check if the backend response contains the email error message
        if (response.data === "Email is already in use.") {
          setSnackbarMessage("Email is already in use.");
          setSnackbarOpen(true);
          return;
        }
      }

      // Reset fields and close modal after successful operation
      setNewStudent({ firstName: "", lastName: "", email: "", password: "" });
      setModalOpen(false);
      setEditStudent(null);
      fetchStudents();
      setSnackbarMessage(
        editStudent
          ? "Student updated successfully."
          : "Student added successfully."
      );
    } catch (error) {
      // Handle the error specifically for email uniqueness issue
      if (
        error.response &&
        error.response.data === "Email is already in use."
      ) {
        setSnackbarMessage("Email is already in use.");
      } else {
        setSnackbarMessage("Error adding/updating student.");
      }
      setSnackbarOpen(true);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password: student.password,
    });
    setEditStudent(student);
    setModalOpen(true);
  };

  const handleOpenDeleteConfirmation = (student) => {
    setStudentToDelete(student);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/students/${studentToDelete.id}`
        );
        fetchStudents();
        setSnackbarMessage("Student deleted successfully.");
      } catch (error) {
        console.error("Error deleting student:", error);
        setSnackbarMessage("Error deleting student.");
      }
      setDeleteConfirmationOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          Student Management
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
            label="Search Students"
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
              setEditStudent(null);
              setNewStudent({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });
            }}
          >
            Add Student
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredStudents.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredStudents
              ).map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEditStudent(student)}
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleOpenDeleteConfirmation(student)}
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
                  count={filteredStudents.length}
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

        {/* Modal for adding/updating a student */}
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
              {editStudent ? "Update Student" : "Add New Student"}
            </Typography>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              variant="standard"
              value={newStudent.firstName}
              onChange={(e) =>
                setNewStudent({ ...newStudent, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              variant="standard"
              value={newStudent.lastName}
              onChange={(e) =>
                setNewStudent({ ...newStudent, lastName: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="standard"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              variant="standard"
              type="password"
              value={newStudent.password}
              onChange={(e) =>
                setNewStudent({ ...newStudent, password: e.target.value })
              }
            />
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddStudent}
            >
              {editStudent ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>

        {/* Confirmation Modal for deleting a student */}
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
            <Typography>
              Are you sure you want to delete this Student?
            </Typography>
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
                onClick={handleDeleteStudent}
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

export default StudentManagement;
