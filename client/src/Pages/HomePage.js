import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import { fetchUsers } from "../Api";
import axios from "axios";
// Material UI imports
import { 
  Avatar, 
  Box, 
  Container,
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

  // Random time for display purposes
  // const getRandomTime = () => {
  //   const hour = Math.floor(Math.random() * 12) + 1;
  //   const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  //   const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
  //   return `${hour}:${minute} ${ampm}`;
  // };
  
  // Get random last message for display purposes
  // const getRandomMessage = () => {
  //   const messages = [
  //     "Hey, how are you?",
  //     "Let's meet tomorrow",
  //     "Did you see that?",
  //     "Thanks for your help",
  //     "Call me when you're free",
  //     "Alright, talk to you later",
  //     "What's the plan?",
  //     "I'll send you the details"
  //   ];
  //   return messages[Math.floor(Math.random() * messages.length)];
  // };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f0f2f5" }}>
      <Navbar userData={userData} />
      
      <Container maxWidth="md" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", py: 2 }}>
        <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
            <Box sx={{ bgcolor: "white", mb: 1 }}>
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
                        // secondary={getRandomMessage()}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 50 }}>
                        <Typography variant="caption" color="textSecondary">
                          {/* {getRandomTime()} */}
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
      </Container>
    </Box>
  );
}