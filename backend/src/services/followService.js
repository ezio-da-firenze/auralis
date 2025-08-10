// services/followService.js
const User = require("../models/User");

const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        throw new Error("You cannot follow yourself");
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
        throw new Error("User to follow not found");
    }

    if (currentUser.following.includes(targetUserId)) {
        throw new Error("Already following this user");
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return { message: "User followed successfully" };
};

const unfollowUser = async (currentUserId, targetUserId) => {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
        throw new Error("User to unfollow not found");
    }

    currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    return { message: "User unfollowed successfully" };
};

module.exports = { followUser, unfollowUser };
