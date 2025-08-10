const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

const router = express.Router();
// Create post
router.post("/", protect, postController.create);

// Public posts
router.get("/public", protect, postController.getPublic);

// Community posts
router.get("/community/:communityId", protect, postController.getCommunity);

// Delete post
router.delete("/:id", protect, postController.remove);

// Update post
router.put("/:postId", protect, postController.updatePost);

// Like post
router.post("/:id/like", protect, postController.toggleLike);

// Bookmark post
router.patch("/bookmark/:id", protect, postController.toggleBookmark);

module.exports = router;
