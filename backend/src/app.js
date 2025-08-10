const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const feedRoutes = require("./routes/feedRoutes");
const followRoutes = require("./routes/followRoutes");

const app = express();

const corsOptions = {
    origin: ["http://localhost:3001", "http://localhost:5173"],
    credentials: true, // to allow cookies
};

// MW
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/communities", communityRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/follow", followRoutes);

app.get("/", (req, res) => res.send("API is running")); // Health check route

app.use(errorHandler);

module.exports = app;
