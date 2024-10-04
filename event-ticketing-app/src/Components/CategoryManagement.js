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
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
    if (!newCategory.name || !newCategory.description) {
      setSnackbarMessage("Enter Category name and Category Description");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editCategory) {
        await axios.put(`http://localhost:8080/categories/${editCategory.id}`, {
          name: newCategory.name,
          description: newCategory.description,
        });
      } else {
        await axios.post(
          "http://localhost:8080/categories/addCategory",
          newCategory
        );
      }
      setNewCategory({ name: "", description: "" });
      setModalOpen(false);
      setEditCategory(null);
      fetchCategories();
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

  const handleOpenDeleteConfirmation = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/categories/${categoryToDelete.id}`
        );
        fetchCategories();
        setSnackbarMessage("Category deleted successfully.");
      } catch (error) {
        console.error("Error deleting category:", error);
        setSnackbarMessage("Error deleting category.");
      }
      setDeleteConfirmationOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          Category Management
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
            label="Search Categories"
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
              setEditCategory(null);
              setNewCategory({ name: "", description: "" });
            }}
          >
            Add Category
          </Button>
        </Box>
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
                ? filteredCategories.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredCategories
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
                      onClick={() => handleOpenDeleteConfirmation(category)}
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
                  count={filteredCategories.length}
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

        {/* Confirmation Modal for deleting a category */}
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
              Are you sure you want to delete this category?
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
                onClick={handleDeleteCategory}
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

export default CategoryManagement;
