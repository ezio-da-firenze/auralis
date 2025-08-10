const Comment = require("../models/Comment");
const Post = require("../models/Post");

const addCommentToPost = async (userId, postId, content) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const comment = await Comment.create({
        post: postId,
        author: userId,
        content,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return comment;
};

const addReplyToComment = async (userId, postId, parentCommentId, content) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) throw new Error("Parent comment not found");

    const reply = await Comment.create({
        post: postId,
        author: userId,
        content,
        parentComment: parentCommentId,
    });

    await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { replyCount: 1 },
    });
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return reply;
};

const getCommentsForPost = async (postId) => {
    return Comment.find({ post: postId, parentComment: null })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 });
};

const getRepliesForComment = async (commentId) => {
    return Comment.find({ parentComment: commentId })
        .populate("author", "username profilePicture")
        .sort({ createdAt: 1 });
};

const toggleLikeComment = async (userId, commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
        comment.likes.pull(userId);
    } else {
        comment.likes.push(userId);
    }

    await comment.save();
    return { comment, liked: !isLiked };
};

const deleteComment = async (userId, commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.author.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

    if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, {
            $inc: { replyCount: -1 },
        });
    }

    await comment.deleteOne(); // hard delete
    return { message: "Comment deleted successfully" };
};

const updateComment = async (commentId, userId, content) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (!comment.author.equals(userId)) throw new Error("Unauthorized");

    comment.content = content;
    await comment.save();
    return comment;
};

module.exports = {
    addCommentToPost,
    addReplyToComment,
    getCommentsForPost,
    getRepliesForComment,
    toggleLikeComment,
    deleteComment,
    updateComment,
};
