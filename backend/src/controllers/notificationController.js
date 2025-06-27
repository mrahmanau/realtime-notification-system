// @desc    Send a notification to all connected clients
// @route   POST /api/notify
// @access  Public (you can protect later with middleware)
exports.sendNotification = (req, res) => {
  console.log("POST /api/notify hit");
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const io = req.app.get("io"); // Access Socket.IO instance

  console.log("Broadcasting notification:", message); // ✅ Add this line

  // Emit the notification to all connected clients
  io.emit("notification", message);

  res.status(200).json({ success: true, message: "Notification sent" });
};
