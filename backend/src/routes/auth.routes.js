const router = require("express").Router();
const passport = require("passport");

// =====================
// GOOGLE
// =====================
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/failure",
        session: true,
    }),
    (_req, res) => {
        res.redirect("/auth/success");
    }
);

// =====================
// DISCORD
// =====================
router.get(
    "/discord",
    passport.authenticate("discord")
);

router.get(
    "/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/auth/failure",
        session: true,
    }),
    (_req, res) => {
        res.redirect("/auth/success");
    }
);

// =====================
// STATUS
// =====================
router.get("/success", (req, res) => {
    res.json({
        message: "Authenticated",
        user: req.user,
    });
});

router.get("/failure", (_req, res) => {
    res.status(401).json({ message: "Authentication failed" });
});

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
