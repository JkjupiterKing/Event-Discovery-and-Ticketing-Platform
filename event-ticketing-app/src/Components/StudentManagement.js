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
    semester: "",
    branch: "",
    year: "",
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
      !newStudent.password ||
      !newStudent.semester ||
      !newStudent.branch ||
      !newStudent.year
    ) {
      setSnackbarMessage(
        "Enter First Name, Last Name, Email, Password, Semester, Branch, and Year."
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editStudent) {
        await axios.put(
          `http://localhost:8080/students/${editStudent.id}`,
          newStudent
        );
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
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        semester: "",
        branch: "",
        year: "",
      });
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
      semester: student.semester,
      branch: student.branch,
      year: student.year,
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
        // Sending DELETE request to the backend
        const response = await axios.delete(
          `http://localhost:8080/students/delete/${studentToDelete.id}`
        );

        // Check if the response is successful (status code 200)
        if (response.status === 200) {
          // Update the students list after successful deletion
          fetchStudents();
          setSnackbarMessage("Student deleted successfully.");
          setSnackbarOpen(true);
        } else {
          // Handle the case when the deletion was not successful
          setSnackbarMessage("Error deleting student.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        setSnackbarMessage("Error deleting student.");
        setSnackbarOpen(true);
      }
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
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
                semester: "",
                branch: "",
                year: "",
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
                <TableCell>Semester</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Year</TableCell>
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
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.year}</TableCell>
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
                  colSpan={7}
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
              width: "500px", // Adjusted width for better layout
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">
              {editStudent ? "Update Student" : "Add New Student"}
            </Typography>

            {/* Grid layout for form fields */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="standard"
                  value={newStudent.firstName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, firstName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="standard"
                  value={newStudent.lastName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, lastName: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Email"
                  fullWidth
                  variant="standard"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  fullWidth
                  variant="standard"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Semester"
                  fullWidth
                  variant="standard"
                  value={newStudent.semester}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, semester: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Branch"
                  fullWidth
                  variant="standard"
                  value={newStudent.branch}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, branch: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Year"
                  fullWidth
                  variant="standard"
                  value={newStudent.year}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, year: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddStudent}
              sx={{ marginTop: "1em" }}
            >
              {editStudent ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>
        <Modal
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
          <div
            style={{
              padding: 20,
              backgroundColor: "white",
              margin: "100px auto",
              width: "400px", // Adjusted width for delete confirmation modal
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">
              Are you sure you want to delete this student?
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
                onClick={() => handleDeleteStudent()}
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
