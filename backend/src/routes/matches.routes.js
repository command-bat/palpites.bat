const router = require("express").Router();
const controller = require("../controllers/matches.controller");
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const isAdmin = require("../middlewares/isAdmin");
const isPremium = require("../middlewares/isPremium");

// Lista resumida
router.get("/", controller.getMatches);

// Data das partidas rescentes
router.get("/days", controller.getMatchDays);
// Datas de todas as partidas
router.get("/days/all", isAuthenticatedJWT, isAdmin, controller.getMatchDays);


// Partida específica (completa)
router.get("/:id", controller.getMatchById);

module.exports = router;
