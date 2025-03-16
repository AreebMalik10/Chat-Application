import React from "react";
import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Chat Application Label */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chat Application
        </Typography>

        {/* User Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">{userData?.username}</Typography>

          {/* Log Out Button */}
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;