module.exports = function isPremium(req, res, next) {
    if (!req.user.isPremium) {
        return res.status(403).json({ message: "Premium only" });
    }
    next();
};