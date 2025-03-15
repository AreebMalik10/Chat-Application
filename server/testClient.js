const { io } = require("socket.io-client");

// Connect to Server
const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    // Send Message Test
    socket.emit("sendMessage", {
        senderId: "67d56772cbbdd8325df63383",
        receiverId: "67d56790cbbdd8325df63386",
        message: "Hello Areeb!"
    });
});

// Listen for messages
socket.on("Receive Message", (data) => {
    console.log("New Message Received:", data);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server.");
});
