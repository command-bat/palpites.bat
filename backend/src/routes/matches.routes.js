const router = require("express").Router();
const controller = require("../controllers/matches.controller");

router.get("/:id", controller.getMatchById);

module.exports = router;
