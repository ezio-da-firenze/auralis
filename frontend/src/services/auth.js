import api from "./api";

export const loginUser = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/users/me");
export const logoutUser = () => api.post("/auth/logout");
export const registerUser = (data) => api.post("/auth/register", data);
