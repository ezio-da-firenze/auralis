const express = require("express");
const { follow, unfollow } = require("../controllers/followController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id", protect, follow);
router.delete("/:id", protect, unfollow);

module.exports = router;
