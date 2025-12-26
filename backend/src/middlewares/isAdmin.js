module.exports = function isAdmin(req, res, next) {
    console.log("REQ.USER =>", req.user);

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin only",
            roleRecebida: req.user.role,
        });
    }

    next();
};
