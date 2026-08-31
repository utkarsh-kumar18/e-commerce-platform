const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

const admin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }
    next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.admin = admin;