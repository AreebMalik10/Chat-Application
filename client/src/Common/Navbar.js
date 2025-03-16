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
    <AppBar 
      position="static"
      sx={{ 
        backgroundColor: "#128C7E", // Darker shade of green for contrast
      }}
    >
      <Toolbar>
        {/* Chat Application Label */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chat Application
        </Typography>

        {/* User Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">{userData?.username}</Typography>

          {/* Log Out Button */}
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight transparency for the button
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)", // Hover effect
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;