const router = require("express").Router();
const passport = require("passport");
const { generateToken } = require("../utils/jwt");

const isProd = process.env.PRODUCTION === "true";

console.log("Está em produção? (x2)", isProd);

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {

        if (!req.user) {
            console.log("Erro: req.user está indefinido");
            return res.redirect(
                (process.env.FRONTEND_URL || "/") + "?error=auth_failed"
            );
        }

        const token = generateToken(req.user);

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
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

        if (!req.user) {
            console.log("Erro: req.user está indefinido");
            return res.redirect(
                (process.env.FRONTEND_URL || "/") + "?error=auth_failed"
            );
        }

        const token = generateToken(req.user);

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.FRONTEND_URL || "/");
    }
);

// LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    res.json({ message: "Logged out" });
});

module.exports = router;
