const router = require("express").Router();
const Match = require("../models/match.model");
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");

router.get("/", isAuthenticatedJWT, async (_req, res) => {
    const matches = await Match.find().sort({ date: 1 });
    res.json(matches);
});

module.exports = router;
