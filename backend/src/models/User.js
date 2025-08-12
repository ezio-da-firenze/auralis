// import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [
                "Student",
                "Developer",
                "ML Engineer",
                "Data Scientist",
                "Data Analyst",
                "Cloud Engineer",
                "DevOps Engineer",
                "QA",
                "Scrum Master",
                "Product Owner",
                "Project Manager",
                "UI/UX Designer",
                "Business Analyst",
                "Operations Manager",
                "Marketing Specialist",
                "Content Creator",
                "Network Engineer",
                "Security Analyst",
                "Ethical Hacker",
                "Technical Writer",
                "Blockchain Developer",
                "Game Developer",
                "Web Developer",
                "Mobile Developer",
                "Software Engineer",
                "Graphic Designer",
            ],
            required: true,
        },
        bio: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        joinedCommunities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Community",
            },
        ],
        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
