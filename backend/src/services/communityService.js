const Community = require("../models/Community");
const User = require("../models/User");
const Post = require("../models/Post");

const createCommunity = async (adminId, data) => {
    const { name, description, category } = data;

    const existing = await Community.findOne({ name });
    if (existing) throw new Error("Community name already exists");

    const community = await Community.create({
        name,
        description,
        category,
        admin: adminId,
        members: [adminId],
    });

    await User.findByIdAndUpdate(adminId, {
        $push: { joinedCommunities: community._id },
    });

    return community;
};

const joinCommunity = async (userId, communityId) => {
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    if (community.members.includes(userId)) throw new Error("Already a member");

    community.members.push(userId);
    await community.save();

    await User.findByIdAndUpdate(userId, {
        $push: { joinedCommunities: communityId },
    });

    return community;
};

const leaveCommunity = async (userId, communityId) => {
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    if (!community.members.includes(userId)) throw new Error("Not a member");

    community.members.pull(userId);
    await community.save();

    await User.findByIdAndUpdate(userId, {
        $pull: { joinedCommunities: communityId },
    });

    return community;
};

const removeMember = async (adminId, communityId, memberId) => {
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    if (community.admin.toString() !== adminId.toString()) {
        throw new Error("Only admin can remove members");
    }

    if (!community.members.includes(memberId))
        throw new Error("User is not a member");

    community.members.pull(memberId);
    await community.save();

    await User.findByIdAndUpdate(memberId, {
        $pull: { joinedCommunities: communityId },
    });

    return community;
};

const getAllCommunities = async () => {
    return Community.find()
        .populate("admin", "username")
        .sort({ createdAt: -1 });
};

const getCommunityById = async (communityId) => {
    return Community.findById(communityId)
        .populate("admin", "username")
        .populate("members", "username");
};

const deleteCommunity = async (adminId, communityId) => {
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    if (community.admin.toString() !== adminId.toString()) {
        throw new Error("Only admin can delete the community");
    }

    // Remove community reference from all users' joinedCommunities
    await User.updateMany(
        { _id: { $in: community.members } },
        { $pull: { joinedCommunities: communityId } }
    );

    // Delete all posts related to this community
    await Post.deleteMany({ community: communityId });

    // Delete the community
    await Community.findByIdAndDelete(communityId);

    return { message: "Community and its posts deleted successfully" };
};

module.exports = {
    createCommunity,
    joinCommunity,
    leaveCommunity,
    removeMember,
    getAllCommunities,
    getCommunityById,
    deleteCommunity,
};
