// Load environment variables from .env file
require("dotenv").config();

// Import the built Express app from app.js
const app = require("./app");

// Import the Node.js HTTP module to create the server
const http = require("http");

// Import Socket.IO for real-time websocket communication
const { Server } = require("socket.io");

// Use the PORT from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a new Socket.IO server instance attached to the HTTP server
// Configure CORS to accept requests from your Angular frontend
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN, // Allow only your frontend origin
    methods: ["GET", "POST"], // Allow GET and POST methods
    credentials: true, // Allow credentials/cookies
  },
});

// Listen for new client connections to Socket.IO
io.on("connection", (socket) => {
  console.log("New client connected, socket id: ", socket.id);

  // Example: Listen for a custom event from client
  socket.on("hello", (data) => {
    console.log("Received hello from client: ", data);

    // Send a response event back to the client
    socket.emit("welcome", "Hello from server!");
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected, socket id: ", socket.id);
  });
});

// Start the HTTP server and listen on the defined port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
