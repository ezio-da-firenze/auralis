const asyncHandler = require("express-async-handler");
const { getUserFeed } = require("../services/feedService");

const fetchUserFeed = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const feedPosts = await getUserFeed(userId);

    res.status(200).json({
        success: true,
        data: feedPosts,
    });
});

module.exports = { fetchUserFeed };
