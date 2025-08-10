// src/services/post.js
import api from "./api";

// Toggle like/unlike post
export const togglePostLike = (postId) => api.post(`/posts/${postId}/like`);

// Get comments for a post
export const getPostComments = (postId) => api.get(`/comments/post/${postId}`);

// Add a new comment
export const addComment = (postId, content) =>
    api.post(`/comments/${postId}`, { content });

// Toggle like/unlike comment
export const toggleCommentLike = (commentId) =>
    api.post(`/comments/${commentId}/like`);

export const createPost = (postData) => api.post("/posts", postData);
