const User = require("../models/User");
const Post = require("../models/Post");

const getUserProfile = async (userId) => {
    const user = await User.findById(userId)
        .select("-passwordHash")
        .populate("joinedCommunities", "name");
    console.log("User profile data:", user);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

const updateUserProfile = async (userId, updates) => {
    const allowedRoles = [
        "Student",
        "Developer",
        "ML Engineer",
        "Data Scientist",
    ];

    // Prevent role change to Admin by normal users
    if (updates.role && !allowedRoles.includes(updates.role)) {
        delete updates.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser;
};

const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        throw new Error("You cannot follow yourself");
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        throw new Error("User not found");
    }

    if (currentUser.following.includes(targetUserId)) {
        throw new Error("Already following this user");
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();
};

const unfollowUser = async (currentUserId, targetUserId) => {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        throw new Error("User not found");
    }

    currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
};
