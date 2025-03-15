const express =  require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const authRoutes = require("./routes/auth")
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

app.get("/", (req, res) => {
    res.send("Chat Application Backend Running...");
})

server.listen(5000, () => {
    console.log("Server is running on port 5000");
})