const express =  require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const { Socket } = require("dgram");
const Message = require("./models/Message");
require("dotenv").config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error);
});

//Routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("Chat Application Backend Running...");
})

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("sendMessage", async (data) =>{
        console.log("Recieved Message Data:", data);
        const {senderId, receiverId, message} = data;

        if(!senderId || !receiverId || !message){
            console.error("Error: Missing required fields");
            return;
        }   

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        await newMessage.save();

        io.emit("Receive Message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", Socket.id);
});
    
})

server.listen(5000, () => {
    console.log("Server is running on port 5000");
})