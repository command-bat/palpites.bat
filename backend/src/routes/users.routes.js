const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const isAuthenticated = require("../middlewares/isAuthenticatedJWT");

/**
 * GET /users/me
 * Retorna o usuário logado (via JWT)
 */
router.get("/me", isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
});

/**
 * GET /users/:id
 * Busca usuário pelo ID
 */
router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            "email name avatar providers createdAt"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            providers: user.providers,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
