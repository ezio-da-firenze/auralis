// src/services/community.js
import api from "./api";

// Create a new community
export const createCommunity = (communityData) =>
    api.post("/communities", communityData);

// Join a community
export const joinCommunity = (communityId) =>
    api.post(`/communities/${communityId}/join`);

// Leave a community
export const leaveCommunity = (communityId) =>
    api.post(`/communities/${communityId}/leave`);

// Get all communities
export const getAllCommunities = () => api.get("/communities");

// Get single community details
export const getCommunityById = (id) => api.get(`/communities/${id}`);

// Delete community (admin only)
export const deleteCommunity = (id) => api.delete(`/communities/${id}`);
