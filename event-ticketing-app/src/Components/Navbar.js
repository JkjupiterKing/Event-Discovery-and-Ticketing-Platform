import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Importing Logout icon
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

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography variant="h6">Event Ticketing</Typography>

        <div>
          <StyledButton component={Link} to="/" startIcon={<HomeIcon />}>
            Home
          </StyledButton>
          <StyledButton
            component={Link}
            to="/events"
            startIcon={<EventNoteIcon />}
          >
            Events
          </StyledButton>
          <StyledButton
            component={Link}
            to="/profile"
            startIcon={<AccountCircleIcon />}
          >
            Profile
          </StyledButton>
          <StyledButton
            component={Link}
            to="/login"
            startIcon={<ExitToAppIcon />}
          >
            Logout
          </StyledButton>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
