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
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/system";
import AssignmentIcon from "@mui/icons-material/Assignment";

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

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("student");
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
            {/* Home link - shared */}
            <ListItem button onClick={() => navigate("/home")} sx={{ pr: 7 }}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            {/* Admin-only options */}
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
                  onClick={() => navigate("/reminders")}
                  sx={{ pr: 7 }}
                >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reminders" />
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
                  <ListItemText primary="Customer Management" />
                </ListItem>
              </>
            )}

            {/* Student-only menu option */}
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

            {/* Registered Events - shared */}
            <ListItem
              button
              onClick={() => navigate("/RegisterEvents")}
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
          {/* ✅ Profile button shown to both admin and student */}
          <StyledButton
            component={Link}
            to="/profile"
            startIcon={<AccountCircleIcon />}
          >
            Profile
          </StyledButton>

          <StyledButton onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Logout
          </StyledButton>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
