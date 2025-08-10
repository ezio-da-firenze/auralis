const { registerUser, loginUser } = require("../services/authService");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
    try {
        const { user, token } = await registerUser(req.body);
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const login = asyncHandler(async (req, res) => {
    try {
        const { user, token } = await loginUser(req.body);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { register, login, logout };
