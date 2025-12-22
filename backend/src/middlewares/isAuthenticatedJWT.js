const jwt = require("jsonwebtoken");

module.exports = function isAuthenticatedJWT(req, res, next) {
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
