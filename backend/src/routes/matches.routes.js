const router = require("express").Router();
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const controller = require("../controllers/matches.controller");

// Lista resumida
router.get("/", isAuthenticatedJWT, controller.getMatches);

// Partida específica (completa)
router.get("/:id", isAuthenticatedJWT, controller.getMatchById);

module.exports = router;
