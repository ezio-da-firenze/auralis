const asyncHandler = require("express-async-handler");
const commentService = require("../services/commentService");

const addComment = asyncHandler(async (req, res) => {
    const comment = await commentService.addCommentToPost(
        req.user._id,
        req.params.postId, // now from URL
        req.body.content
    );
    res.status(201).json(comment);
});

const replyToComment = asyncHandler(async (req, res) => {
    const reply = await commentService.addReplyToComment(
        req.user._id,
        req.params.postId, // now from URL
        req.params.commentId,
        req.body.content
    );
    res.status(201).json(reply);
});

const getCommentsForPost = asyncHandler(async (req, res) => {
    const comments = await commentService.getCommentsForPost(req.params.postId);
    res.json(comments);
});

const getRepliesForComment = asyncHandler(async (req, res) => {
    const replies = await commentService.getRepliesForComment(
        req.params.commentId
    );
    res.json(replies);
});

const toggleLike = asyncHandler(async (req, res) => {
    const result = await commentService.toggleLikeComment(
        req.user._id,
        req.params.commentId
    );
    res.json(result);
});

const deleteComment = asyncHandler(async (req, res) => {
    const result = await commentService.deleteComment(
        req.user._id,
        req.params.commentId
    );
    res.json(result);
});

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const updatedComment = await commentService.updateComment(
            commentId,
            userId,
            content
        );
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addComment,
    replyToComment,
    getCommentsForPost,
    getRepliesForComment,
    toggleLike,
    deleteComment,
    updateComment,
};
