const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticatedJWT");
const usersController = require("../controllers/users.controller");


/**
 * GET /users/me
 * Retorna o usuário logado (via JWT)
 */
router.get("/me", isAuthenticated, usersController.getUserMe);


/**
 * GET /users/:userId/stats
 * Retorna o stats do user
 */
router.get("/stats/:userId", isAuthenticated, usersController.getUserStats);

/**
 * GET /users/:id
 * Busca usuário pelo ID
 */
router.get("/:id", isAuthenticated, usersController.getUserId);



module.exports = router;
