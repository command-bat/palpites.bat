const router = require("express").Router();
const controller = require("../controllers/friends.controller");
const isAuthenticatedJWT = require("../middlewares/isAuthenticatedJWT");
const isAdmin = require("../middlewares/isAdmin");
const isPremium = require("../middlewares/isPremium");


// SEMPRE QUE FOR USERID PODE SER O NOME DO USER OU O EMAIL

// retorna os amigos do user logado
router.get("/", isAuthenticatedJWT, controller.getMyFriends);

// retorna os amigos do user especifico
router.get("/:userId", isAuthenticatedJWT, controller.getUserFriends);

//enviar pedido de amizade ao user 
router.post("/add/:userId", isAuthenticatedJWT, controller.sendFriendRequest);

//cancelar pedido de amizade ao user
router.post("/canceladd/:userId", isAuthenticatedJWT, controller.cancelSendFriendRequest);

//lista de pedidos recebidos do user logado
router.get("/orders/received", isAuthenticatedJWT, controller.getReceivedOrders);

//lista de pedidos recebidos do user logado
router.get("/orders/send", isAuthenticatedJWT, controller.getSendOrders);

//Aceita um pedido do user
router.post("/orders/:userId/accept", isAuthenticatedJWT, controller.acceptOrder);

//Rejeita um pedido do user
router.post("/orders/:userId/reject", isAuthenticatedJWT, controller.rejectOrder);



module.exports = router;
