import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import { fetchUsers } from "../Api";
import axios from "axios";
// Material UI imports
import { 
  Avatar, 
  Box, 
  Divider,
  IconButton,
  InputAdornment,
  List, 
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography 
} from "@mui/material";
import { 
  Search as SearchIcon,
  Message as MessageIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  console.log("User Data in Home Page:", userData);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [recentChats, setRecentChats] = useState(() => {
    return JSON.parse(localStorage.getItem("recentChats")) || [];
  });

  const API = axios.create({ baseURL: "http://localhost:5000" });
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchUsers(search);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (search.length > 0) fetchUser();
  }, [search]);

  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!userData?._id) return;
      
      try {
        const res = await API.get(`/chat/recent/${userData.id}`);
        console.log("Recent Chats from API:", res.data);
        setRecentChats(res.data);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };
  
    fetchRecentChats();
  }, []);
  
  const handleChatStart = (selectedUser) => {
    console.log("Navigating to chat with user:", selectedUser);
    console.log("Current user data:", userData);
    
    // Check if user is already in recent chats
    setRecentChats((prevChats) => {
      const updatedChats = prevChats.some((chat) => chat._id === selectedUser._id)
        ? prevChats
        : [selectedUser, ...prevChats].slice(0, 5); // Store last 5 chats

      localStorage.setItem("recentChats", JSON.stringify(updatedChats));
      return updatedChats;
    });

    navigate(`/chat`, { 
      state: { selectedUser, userData }
    });
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f0f2f5" }}>
      <Navbar userData={userData} />
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "row", 
        height: "calc(100vh - 64px)", // Assuming Navbar height is 64px
        overflow: "hidden"
      }}>
        {/* Left Side Chat List Panel - WhatsApp Style */}
        <Paper sx={{ 
          width: "30%", 
          minWidth: "300px", 
          maxWidth: "420px", 
          height: "100%", 
          display: "flex", 
          flexDirection: "column", 
          borderRadius: 0
        }}>
          {/* Header */}
          <Box sx={{ bgcolor: "#00a884", color: "white", p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", pl: 1 }}>Chat With Us</Typography>
            <Box>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit">
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Search Box */}
          <Box sx={{ p: 1, bgcolor: "#f0f2f5" }}>
            <TextField
              fullWidth
              placeholder="Search or start new chat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 4, bgcolor: "white" }
              }}
            />
          </Box>
          
          {/* User Search Results */}
          {search.length > 0 && users?.length > 0 && (
            <Box sx={{ bgcolor: "white", mb: 1, overflow: "auto" }}>
              <Typography variant="subtitle1" sx={{ p: 1, fontWeight: "bold" }}>
                Search Results
              </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem 
                      alignItems="flex-start"
                      button 
                      onClick={() => handleChatStart(user)}
                      sx={{ 
                        "&:hover": { bgcolor: "#f5f5f5" },
                        py: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#' + Math.floor(Math.random()*16777215).toString(16) }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary="Click to start a new chat"
                      />
                      <IconButton size="small" color="primary">
                        <MessageIcon />
                      </IconButton>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
          
          {/* Recently Chatted Users */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <Typography variant="subtitle1" sx={{ p: 1, fontWeight: "bold", bgcolor: "#f0f2f5" }}>
              Recent Chats
            </Typography>
            {recentChats.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Typography variant="body1" color="textSecondary">
                  No recent chats
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                {recentChats.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem 
                      alignItems="flex-start"
                      button 
                      onClick={() => handleChatStart(user)}
                      sx={{ 
                        "&:hover": { bgcolor: "#f5f5f5" },
                        py: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#' + Math.floor(Math.random()*16777215).toString(16) }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 50 }}>
                        <Typography variant="caption" color="textSecondary">
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>
        
        {/* Right Side Chat Area - Initially Empty */}
        <Box sx={{ 
          flexGrow: 1, 
          bgcolor: "#f0f2f5", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center",
          backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundSize: "contain",
          position: "relative"
        }}>
          <Paper sx={{ 
            py: 4, 
            px: 6, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            bgcolor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 2,
            maxWidth: "80%"
          }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#128C7E" }}>
              Welcome to Chat App
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: "center", color: "#666" }}>
              Select a chat to start messaging
            </Typography>
            <Box component="img" 
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzEyOEM3RSIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik0xOS4zNTUgNC44NjJjLjAzNy0uMDcuMDg2LS4xMy4xMTYtLjE5OC4xODQtLjQxMiAyLjAwMi0yLjgxMiAyLjAwMi0yLjgxMi4yODctLjQxMi4yNTgtLjk2NS0uMDY1LTEuMzVDMjEuMTg0LjE3MSAyMC43MjcuMDEgMjAuMjU1LjEwMmwuMDAyLS4wMUwxNi40MTcgMS4wNWMtLjU1LjEzNS0xLjEzMi4wNi0xLjYwNi0uMjdsLTEuNTUtMS4wOWMtLjYzLS40NDItMS40NTYtLjU0OC0yLjE4LS4yNTcgMCAwLTMuMjk3IDEuMzIzLTkuMzEgNi4zNjhDLjE5MSA3LjA0NS4wMDggOC4zNzIuMDAxIDkuNzUzYy0uMDA2IDEuMDkuMTM3IDIuMTk3LjYxIDMuMTg1LjU4OCAxLjIzMSAxLjA1MiAyLjMxOCAxLjQyIDMuMzA5LjY4NyAxLjgzNy45OCA0LjAyLjk4IDUuODY0IDAgLjQxMi4xNjcuODEyLjQ2IDEuMTA2LjI5NS4yOTUuNjk4LjQ2IDEuMTEuNDYgNCAwIDYuODI1LTEuOTc1IDguMjU4LTMuMjYuNzE0LS42NDQuNzgyLTEuNzMzLjE1OC0yLjQ2N2wtMS4zMjctMS41NjVjLS4zMzctLjM5Ny0uNDctLjkxMi0uMzUtMS40MjUgMCAwIC4zMzgtMS40MTMuODc4LTIuMzc3LjA4NC0uMTUuMTg1LS4yNzUuMjgyLS40MDUuMjA1LS4yNzUuMjc0LS42LjE2MS0uODk2bC0uNTg3LTEuNTI1Yy0uMDU3LS4xNS0uMDU3LS4zLjAwNy0uNDVsMi4wNC00LjczYy4wNjUtLjE1OC4xNzMtLjI4OC4zMS0uMzgybDMuNzQ2LTIuNTY2Yy41MjctLjM2IDEuMjI0LS4yMzkgMS42OC4yNjRsLjIwNC4yMjdjLjI1LjI4LjY3MS4zNjUgMS4wMzUuMjMxLjM4Mi0uMTQyLjc1LS4zMTEgMS4xMDMtLjQ5NS4yMzQtLjEyMi4zNjMtLjM1MS40NTQtLjU5Mi4wNTktLjE1OS4xNTMtLjMzNC4yMDctLjQ5MyIvPjwvc3ZnPg=="
              alt="Chat Icon"
              sx={{ width: 128, height: 128, opacity: 0.8 }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}