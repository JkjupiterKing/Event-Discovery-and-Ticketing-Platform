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

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSnackbarMessage("Error fetching categories.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      if (editCategory) {
        // Update existing category
        await axios.put(`http://localhost:8080/categories/${editCategory.id}`, {
          name: newCategory.name,
          description: newCategory.description,
        });
      } else {
        // Add new category
        await axios.post(
          "http://localhost:8080/categories/addCategory",
          newCategory
        );
      }
      // Reset form fields
      setNewCategory({ name: "", description: "" });
      setModalOpen(false);
      setEditCategory(null);
      fetchCategories(); // Refresh the category list
      setSnackbarMessage(
        editCategory
          ? "Category updated successfully."
          : "Category added successfully."
      );
    } catch (error) {
      console.error("Error adding/updating category:", error);
      setSnackbarMessage("Error adding/updating category.");
    }
    setSnackbarOpen(true);
  };

  const handleEditCategory = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${id}`);
      fetchCategories(); // Refresh the category list
      setSnackbarMessage("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbarMessage("Error deleting category.");
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Pagination handlers
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
          Category Management
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setModalOpen(true);
            setEditCategory(null);
            setNewCategory({ name: "", description: "" }); // Reset form on open
          }}
          sx={{ marginLeft: "74em" }}
        >
          Add Category
        </Button>
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Category Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? categories.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : categories
              ).map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEditCategory(category)}
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleDeleteCategory(category.id)}
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
                  colSpan={3}
                  count={categories.length}
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

        {/* Modal for adding/updating a category */}
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
              {editCategory ? "Update Category" : "Add New Category"}
            </Typography>
            <TextField
              label="Category Name"
              fullWidth
              margin="normal"
              variant="standard"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <TextField
              label="Category Description"
              fullWidth
              margin="normal"
              variant="standard"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddCategory}
            >
              {editCategory ? "Update" : "Add"}
            </Button>
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

export default CategoryManagement;
