const User = require("../models/User");
const {
    getUserProfile,
    updateUserProfile,
} = require("../services/userService");
const asyncHandler = require("express-async-handler");

const getProfile = asyncHandler(async (req, res) => {
    try {
        const user = await getUserProfile(req.user._id);
        user.populate("joinedCommunities", "name");
        // const user = await User.findById(userId)
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
});

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const updatedUser = await updateUserProfile(req.user._id, req.body);
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await userService.getUserProfile(
            req.params.id,
            req.user?._id
        );
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
