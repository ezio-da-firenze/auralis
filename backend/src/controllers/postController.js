const postService = require("../services/postService");
const asyncHandler = require("express-async-handler");

const create = asyncHandler(async (req, res) => {
    try {
        const post = await postService.createPost(req.user._id, req.body);
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const getPublic = asyncHandler(async (req, res) => {
    try {
        const posts = await postService.getPublicPosts();
        res.json(posts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const getCommunity = asyncHandler(async (req, res) => {
    try {
        const posts = await postService.getCommunityPosts(
            req.user._id,
            req.params.communityId
        );
        res.json(posts);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

const remove = asyncHandler(async (req, res) => {
    try {
        const result = await postService.deletePost(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const updatedPost = await postService.updatePost(
            postId,
            userId,
            content
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const toggleLike = asyncHandler(async (req, res) => {
    try {
        const result = await postService.toggleLikePost(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const toggleBookmark = async (req, res) => {
    try {
        const result = await postService.toggleBookmarkPost(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    create,
    getPublic,
    getCommunity,
    remove,
    toggleLike,
    toggleBookmark,
    updatePost,
};
