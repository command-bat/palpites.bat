const router = require("express").Router();
const controller = require("../controllers/palpite.controller");
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const isAdmin = require("../middlewares/isAdmin");
const isPremium = require("../middlewares/isPremium");


router.post("/", isAuthenticatedJWT, controller.createPalpite);

// Quantidades de palpites da partida
router.get("/match/:matchId", isPremium, isAuthenticatedJWT, controller.getPalpiteByIdMatch);

// Rota sem userId (usa o logado)
router.get("/user", isAuthenticatedJWT, controller.getPalpiteByIdUser);

// Rota com userId
router.get("/user/:userId", isAuthenticatedJWT, controller.getPalpiteByIdUser);


module.exports = router;
