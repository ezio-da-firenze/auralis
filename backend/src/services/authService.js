const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async ({ username, email, password, role }) => {
    const allowedRoles = [
        "Student",
        "Developer",
        "ML Engineer",
        "Data Scientist",
    ];

    if (!allowedRoles.includes(role)) {
        role = "Student";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
        role,
    });

    return { user, token: generateToken(user._id) };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user._id);
    return { user, token };
};

module.exports = { registerUser, loginUser };
