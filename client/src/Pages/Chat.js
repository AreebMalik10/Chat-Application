import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import { fetchMessages } from "../Api";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  AppBar, 
  Toolbar,
  InputAdornment
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallIcon from "@mui/icons-material/Call";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const socket = io("http://localhost:5000");

export default function Chat() {
  const { userId } = useParams(); // Dynamic parameter from the URL
  const location = useLocation();
  const selectedUser = location.state?.selectedUser;
  const userData = location.state?.userData;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedUser || !userData) {
      console.error("Missing selectedUser or userData in navigation state");
      return;
    }

    const fetchMessagesFromAPI = async () => {
      try {
        const response = await fetchMessages(userData.userId, selectedUser?._id);
        console.log("API Response:", response);
        
        // Handle both direct array or nested data structure
        const messagesData = response.data || response;
        
        if (Array.isArray(messagesData)) {
          setMessages(messagesData);
        } else {
          console.error("Messages data is not an array:", messagesData);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessagesFromAPI();

    socket.on("Receive Message", (newMessage) => {
      console.log("Received Message:", newMessage);
      if (newMessage && typeof newMessage === "object") {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("Receive Message");
    };
  }, [selectedUser, userData]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      senderId: userData?.userId,
      receiverId: selectedUser?._id,
      message,
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  const messagesEndRef = React.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#075E54" }}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>
            {selectedUser?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {selectedUser?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: "#E0E0E0" }}>
              Online
            </Typography>
          </Box>
          <IconButton color="inherit">
            <CallIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#ECE5DD",
          backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundRepeat: "repeat",
          p: 2
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            
            const isCurrentUserSender = msg.senderId === userData._id || msg.senderId === userData.userId;
            
            const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isCurrentUserSender ? "flex-end" : "flex-start",
                  mb: 1.5
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    px: 2,
                    maxWidth: "70%",
                    borderRadius: 2,
                    bgcolor: isCurrentUserSender ? "#DCF8C6" : "#FFFFFF"
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: "text.secondary",
                      display: "block",
                      textAlign: "right",
                      mt: 0.5
                    }}
                  >
                    {time}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
          >
            No messages yet. Start the conversation!
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "#F0F2F5"
        }}
      >
        <IconButton sx={{ mr: 1 }}>
          <EmojiEmotionsIcon />
        </IconButton>
        <IconButton sx={{ mr: 1 }}>
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          fullWidth
          placeholder="Type a message"
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          sx={{ mr: 1 }}
        />
        
        <IconButton 
          color="primary" 
          onClick={sendMessage}
          sx={{ bgcolor: "#075E54", color: "white", "&:hover": { bgcolor: "#075E54", opacity: 0.9 } }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}