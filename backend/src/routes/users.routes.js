const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const isAuthenticated = require("../middlewares/isAuthenticatedJWT");


router.get("/user/:id", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            provider: user.provider,
            avatar: user.avatar,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/me", isAuthenticated, (req, res) => {
    const user = req.user;

    res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar,
    });
});

module.exports = router;
