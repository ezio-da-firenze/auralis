const express = require("express");
const { fetchUserFeed } = require("../controllers/feedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, fetchUserFeed);

module.exports = router;
