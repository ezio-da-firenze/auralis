// services/feed.js
import api from "./api";

export const getFeed = () => api.get("/feed");
