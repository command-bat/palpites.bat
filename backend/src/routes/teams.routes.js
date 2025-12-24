const router = require("express").Router();
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const controller = require("../controllers/teams.controller");

router.get("/:id", isAuthenticatedJWT, controller.getTeamById);

module.exports = router;
