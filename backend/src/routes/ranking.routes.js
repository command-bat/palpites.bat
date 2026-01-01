const router = require("express").Router();
const controller = require("../controllers/ranking.controller");
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");

router.get("/", isAuthenticatedJWT, controller.getRanking);

module.exports = router;
