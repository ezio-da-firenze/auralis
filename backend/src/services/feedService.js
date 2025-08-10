const Post = require("../models/Post");
const User = require("../models/User");

const getUserFeed = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // 1. Get relevant posts
    const mainPosts = await Post.find({
        $or: [
            { community: { $in: user.joinedCommunities } },
            { author: { $in: user.following } },
            { author: user._id },
        ],
    })
        .sort({ createdAt: -1 })
        .populate("author", "username")
        .populate("community", "name");

    const mainPostIds = mainPosts.map((post) => post._id.toString());

    // 2. Get public posts (community === null), excluding those already in feed
    const publicPosts = await Post.find({
        community: null,
        _id: { $nin: mainPostIds },
    })
        .sort({ createdAt: -1 })
        .populate("author", "username")
        .populate("community", "name");

    // 3. Final feed: relevant posts first, public posts next
    const fullFeed = [...mainPosts, ...publicPosts];

    return fullFeed;
};

module.exports = { getUserFeed };
