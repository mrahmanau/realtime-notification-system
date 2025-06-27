const express = require("express");
const router = express.Router();
const { sendNotification } = require("../controllers/notificationController");

// POST /api/notify
router.post("/notify", sendNotification);

module.exports = router;
