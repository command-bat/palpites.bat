const router = require("express").Router();
const controller = require("../controllers/ranking.controller");

router.get("/", controller.getRanking);

module.exports = router;
