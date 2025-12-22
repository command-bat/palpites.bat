const router = require("express").Router();
const passport = require("passport");
const { generateToken } = require("../utils/jwt");

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = generateToken(req.user);

        res.cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.FRONTEND_URL || "/");
    }
);

// DISCORD
router.get("/discord", passport.authenticate("discord"));

router.get(
    "/discord/callback",
    passport.authenticate("discord", { session: false }),
    (req, res) => {
        const token = generateToken(req.user);

        res.cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.FRONTEND_URL || "/");
    }
);

// LOGOUT
router.get("/logout", (_req, res) => {
    res.clearCookie("auth_token");
    res.json({ message: "Logged out" });
});

module.exports = router;
