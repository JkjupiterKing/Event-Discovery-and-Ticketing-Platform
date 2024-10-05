import React, { useState } from "react";
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
import PlaceIcon from "@mui/icons-material/Place"; // Import for City Management
import CategoryIcon from "@mui/icons-material/Category"; // Import for Category Management
import { styled } from "@mui/system";

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
  marginRight: "50em",
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

  const handleLogout = () => {
    localStorage.removeItem("user");
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
            style={{ width: 40, marginRight: 4 }}
          />
          <Typography variant="h6" style={{ margin: 0 }}>
            Event Ticketing
          </Typography>
        </LogoContainer>

        <StyledDrawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => navigate("/home")} sx={{ pr: 7 }}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => navigate("/events")} sx={{ pr: 7 }}>
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
                <CategoryIcon /> {/* Icon for Category Management */}
              </ListItemIcon>
              <ListItemText primary="Category Management" />
            </ListItem>
            <ListItem
              button
              onClick={() => navigate("/city-management")}
              sx={{ pr: 7 }}
            >
              <ListItemIcon>
                <PlaceIcon /> {/* Icon for City Management */}
              </ListItemIcon>
              <ListItemText primary="City Management" />
            </ListItem>
          </List>
        </StyledDrawer>
        <div>
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
