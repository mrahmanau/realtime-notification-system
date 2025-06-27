// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const cors = require("cors");

// Create an instance of the Express application
const app = express();

// Use built-in middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for frontend origin (e.g., Angular running on port 4200)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Only allow requests from this origin
    credentials: true, // Allow cookies and credentials (if needed)
  })
);

const notificationRoutes = require("./routes/notificationRoutes");
// Mount the route
app.use("/api", notificationRoutes);

// Export the configured app so it can be used in server.js
module.exports = app;
