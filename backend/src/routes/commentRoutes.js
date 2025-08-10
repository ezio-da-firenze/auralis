const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

const router = express.Router();

// Add a top-level comment to a post (postId from URL)
router.post("/:postId", protect, commentController.addComment);

// Reply to a comment (postId from URL)
router.post(
    "/:postId/:commentId/reply",
    protect,
    commentController.replyToComment
);

// Get comments for a post
router.get("/post/:postId", protect, commentController.getCommentsForPost);

// Get replies for a comment
router.get(
    "/:commentId/replies",
    protect,
    commentController.getRepliesForComment
);

// Like/unlike a comment
router.post("/:commentId/like", protect, commentController.toggleLike);

// Delete a comment
router.delete("/:commentId", protect, commentController.deleteComment);

// Update comment
router.put("/:commentId", protect, commentController.updateComment);

module.exports = router;
