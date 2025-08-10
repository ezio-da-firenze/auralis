const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const communityController = require("../controllers/communityController");

const router = express.Router();

router.post("/", protect, communityController.create);

router.post("/:id/join", protect, communityController.join);
router.post("/:id/leave", protect, communityController.leave);

router.delete("/:id/members/:memberId", protect, communityController.remove);

router.get("/", protect, communityController.getAll);

router.get("/:id", protect, communityController.getOneCommunity);

router.delete("/:id", protect, communityController.deleteCommunity);

module.exports = router;
