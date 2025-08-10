const communityService = require("../services/communityService");
const asyncHandler = require("express-async-handler");

const create = asyncHandler(async (req, res) => {
    try {
        const community = await communityService.createCommunity(
            req.user._id,
            req.body
        );
        res.status(201).json(community);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const join = asyncHandler(async (req, res) => {
    try {
        const community = await communityService.joinCommunity(
            req.user._id,
            req.params.id
        );
        res.json(community);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const leave = asyncHandler(async (req, res) => {
    try {
        const community = await communityService.leaveCommunity(
            req.user._id,
            req.params.id
        );
        res.json(community);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const remove = asyncHandler(async (req, res) => {
    try {
        const community = await communityService.removeMember(
            req.user._id,
            req.params.id,
            req.params.memberId
        );
        res.json(community);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const getAll = asyncHandler(async (req, res) => {
    try {
        const communities = await communityService.getAllCommunities();
        res.json(communities);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const getOneCommunity = asyncHandler(async (req, res) => {
    try {
        const community = await communityService.getCommunityById(
            req.params.id
        );
        if (!community)
            return res.status(404).json({ message: "Community not found" });
        res.json(community);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const deleteCommunity = asyncHandler(async (req, res) => {
    try {
        const result = await communityService.deleteCommunity(
            req.user._id,
            req.params.id
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = {
    create,
    join,
    leave,
    remove,
    getAll,
    getOneCommunity,
    deleteCommunity,
};
