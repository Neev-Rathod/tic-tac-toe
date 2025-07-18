const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDb = require("./config/Database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");
const socketHandler = require("./sockets/socketHandler");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173/", "https://tic-tac-toe-t9x2.vercel.app"], // or '*' for all
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Connect to database
connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Tic Tac Toe API");
});
// Socket.IO handling
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
