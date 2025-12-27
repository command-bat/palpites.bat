const router = require("express").Router();
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const isAdmin = require("../middlewares/isAdmin");
const controller = require("../controllers/admin.controller");

router.get("/isAdmin", isAuthenticatedJWT, isAdmin, controller.isAdmin);

router.post("/fetch", isAuthenticatedJWT, isAdmin, controller.fetch);

module.exports = router;
