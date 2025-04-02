import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CategoryIcon from "@mui/icons-material/Category"; // Import for Category Management
import CloseIcon from "@mui/icons-material/Close"; // Import for Close Icon
import PersonIcon from "@mui/icons-material/Person"; // Icon for Student Management
import { styled } from "@mui/system";
import AssignmentIcon from "@mui/icons-material/Assignment"; // Icon for Registered Events

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(to right, #D5006D, #FF6F20)",
  padding: "0px",
  margin: "0",
});

const StyledToolbar = styled(Toolbar)({
  padding: "0",
  justifyContent: "space-between",
});

const StyledButton = styled(Button)({
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

const LogoContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginRight: "48em",
});

// Optional: Create a styled drawer component
const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    background: "linear-gradient(to right, #D5006D, #FF6F20)",
    color: "#FAF7F0",
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [role, setRole] = useState("");

  // Check role from local storage when component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole); // Set role based on the localStorage
    }
  }, []);

  const handleLogout = () => {
    // Remove both user and role from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("student");

    // Navigate to the login page after logout
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <LogoContainer>
          <img
            src={`${process.env.PUBLIC_URL}/ticket.gif`}
            alt="Logo"
            style={{ width: 40 }}
          />
          <Typography variant="h6" style={{ margin: 0 }}>
            Event Registration
          </Typography>
        </LogoContainer>

        <StyledDrawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <div style={{ padding: 16 }}>
            <IconButton
              onClick={toggleDrawer(false)}
              style={{ color: "#FAF7F0" }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <List>
            {/* Home link - for both Admin and Student */}
            <ListItem
              button
              onClick={() => navigate(role === "admin" ? "/home" : "/home")}
              sx={{ pr: 7 }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            {/* Show this for Admin only */}
            {role === "admin" && (
              <>
                <ListItem
                  button
                  onClick={() => navigate("/events")}
                  sx={{ pr: 7 }}
                >
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Events Management" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => navigate("/category-management")}
                  sx={{ pr: 7 }}
                >
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Category Management" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => navigate("/Student-Management")}
                  sx={{ pr: 7 }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Student Management" />
                </ListItem>
              </>
            )}

            {/* Show this for Student only */}
            {role === "student" && (
              <ListItem
                button
                onClick={() => navigate("/Student-Home")}
                sx={{ pr: 7 }}
              >
                <ListItemIcon>
                  <EventNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Events" />
              </ListItem>
            )}

            {/* Register Events - Visible to both Admin and Student */}
            <ListItem
              button
              onClick={() =>
                navigate(
                  role === "admin" ? "/RegisterEvents" : "/RegisterEvents"
                )
              }
              sx={{ pr: 7 }}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Registered Events" />
            </ListItem>
          </List>
        </StyledDrawer>
        <div>
          {/* Show the Profile button only for Admin */}
          {role === "admin" && (
            <StyledButton
              component={Link}
              to="/profile"
              startIcon={<AccountCircleIcon />}
            >
              Profile
            </StyledButton>
          )}
          <StyledButton onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Logout
          </StyledButton>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
