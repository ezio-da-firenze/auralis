const followService = require("../services/followService");

const follow = async (req, res) => {
    try {
        const result = await followService.followUser(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const unfollow = async (req, res) => {
    try {
        const result = await followService.unfollowUser(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { follow, unfollow };
