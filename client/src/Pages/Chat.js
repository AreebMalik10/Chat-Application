import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import { fetchMessages } from "../Api";

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
        
        const messagesData = response.data || response;
        console.log("Messages Data to set:", messagesData);
        
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

  // Debug log whenever messages state changes
  useEffect(() => {
    console.log("Messages State Updated:", messages);
    console.log("Messages Array Length:", messages.length);
    console.log("Is messages an array?", Array.isArray(messages));
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      senderId: userData?.userId,
      receiverId: selectedUser?._id,
      message,
    };

    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  console.log("Current userData:", userData);
  console.log("Selected User:", selectedUser);

  return (
    <div>
      <h2>Chat with {selectedUser?.username}</h2>
      
      <div style={{ fontSize: '12px', color: 'gray', marginBottom: '10px' }}>
        Messages loaded: {messages.length}
      </div>
      
      <div style={{ border: "1px solid gray", height: "300px", overflowY: "scroll", padding: "10px" }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => {

            const isCurrentUserSender = msg.senderId === userData.userId;
            
            return (
              <div 
                key={index} 
                style={{ 
                  textAlign: isCurrentUserSender ? "right" : "left",
                  marginBottom: "10px"
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: isCurrentUserSender ? "#dcf8c6" : "#f1f0f0",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    maxWidth: "70%"
                  }}
                >
                  <strong>{isCurrentUserSender ? "You" : selectedUser.username}</strong>
                  <div>{msg.message}</div>
                  <div style={{ fontSize: "10px", color: "#999", textAlign: "right" }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      
      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flexGrow: 1, padding: "8px" }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          style={{ marginLeft: "10px", padding: "8px 16px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}