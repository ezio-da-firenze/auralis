const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res
                .status(401)
                .json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-passwordHash");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = { protect };
