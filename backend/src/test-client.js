const { io } = require("socket.io-client");

// Connect to the backend WebSocket server
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

// When connected
socket.on("connect", () => {
  console.log("Connected to server, socket id:", socket.id);

  // Send a 'hello' event to the server
  socket.emit("hello", "Hi backend, this is test client!");
});

// Listen for 'welcome' event from the server
socket.on("welcome", (message) => {
  console.log("Received from server:", message);

  // Close connection after receiving message
  socket.close();
});

// Handle disconnect
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
