const router = require("express").Router();
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const controller = require("../controllers/matches.controller");

// Lista resumida
router.get("/", controller.getMatches);

// Partida específica (completa)
router.get("/:id", controller.getMatchById);

module.exports = router;
