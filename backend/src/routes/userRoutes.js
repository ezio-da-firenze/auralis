const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, getUserProfileById } = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getProfile);
router.post("/me", protect, updateProfile);
router.get("/:id", protect, getUserProfileById);


module.exports = router;
