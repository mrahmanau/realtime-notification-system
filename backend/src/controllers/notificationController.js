// @desc    Send a notification to all connected clients
// @route   POST /api/notify
// @access  Public (you can protect later with middleware)
exports.sendNotification = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const io = req.app.get("io"); // Access Socket.IO instance

  const payload = {
    message,
    timestamp: new Date().toISOString(), // Use ISO string for consistent parsing
  };

  // Emit the notification to all connected clients
  io.emit("notification", payload); // Emit an object now

  res.status(200).json({ success: true, message: "Notification sent" });
};
