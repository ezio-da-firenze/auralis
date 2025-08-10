const Post = require("../models/Post");
const Community = require("../models/Community");
const User = require("../models/User");

const createPost = async (userId, { content, mediaUrls, communityId }) => {
    if (communityId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found");

        // Check if user is member of the community
        if (!community.members.includes(userId)) {
            throw new Error("You must be a member to post in this community");
        }
    }

    const post = await Post.create({
        author: userId,
        content,
        mediaUrls: mediaUrls || [],
        community: communityId || null,
    });

    if (communityId) {
        await Community.findByIdAndUpdate(communityId, {
            $inc: { postCount: 1 },
        });
    }

    return post;
};

const getPublicPosts = async () => {
    return Post.find({ community: null })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 });
};

const getCommunityPosts = async (userId, communityId) => {
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    // Check membership
    if (!community.members.includes(userId)) {
        throw new Error("You are not a member of this community");
    }

    return Post.find({ community: communityId })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 });
};

const deletePost = async (userId, postId) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    // Allow only author (admin logic can be added later)
    if (post.author.toString() !== userId.toString()) {
        throw new Error("Not authorized to delete this post");
    }

    await post.deleteOne(); // instead of remove()
    return { message: `${post.id} Post deleted successfully` };
};

const updatePost = async (postId, userId, content) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    if (!post.author.equals(userId)) throw new Error("Unauthorized");

    post.content = content;
    await post.save();
    return post;
};

const toggleLikePost = async (userId, postId) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();
    return { post, liked: !isLiked };
};
const toggleBookmarkPost = async (userId, postId) => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const index = user.bookmarks.indexOf(postId);
    let isBookmarked;

    if (index === -1) {
        user.bookmarks.push(postId);
        isBookmarked = true;
    } else {
        user.bookmarks.splice(index, 1);
        isBookmarked = false;
    }

    await user.save();

    return { bookmarked: isBookmarked };
};

module.exports = {
    createPost,
    getPublicPosts,
    getCommunityPosts,
    deletePost,
    toggleLikePost,
    toggleBookmarkPost,
    updatePost,
};
