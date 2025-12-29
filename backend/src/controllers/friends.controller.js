const User = require("../models/user.model");
const mongoose = require("mongoose");

// helper: achar user por id, email ou nome
async function findUser(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        return User.findById(identifier);
    }

    return User.findOne({
        $or: [
            { email: identifier },
            { name: identifier },
        ],
    });
}

// Amigos do user logado
exports.getMyFriends = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("friends.friends", "name email avatar");

    res.json(user.friends.friends);
};

// Amigos de um user específico
exports.getUserFriends = async (req, res) => {
    const user = await findUser(req.params.userId);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.populate("friends.friends", "name email avatar");
    res.json(user.friends.friends);
};

// Enviar pedido de amizade
exports.sendFriendRequest = async (req, res) => {
    const from = await User.findById(req.user.id);
    const to = await findUser(req.params.userId);

    if (!to || from.id === to.id) {
        return res.status(400).json({ message: "Usuário inválido" });
    }

    // já são amigos
    if (from.friends.friends.includes(to.id)) {
        return res.status(400).json({ message: "Já são amigos" });
    }

    // ele já me enviou pedido → aceita automático
    if (from.friends.received.includes(to.id)) {
        from.friends.received.pull(to.id);
        to.friends.send.pull(from.id);

        from.friends.friends.push(to.id);
        to.friends.friends.push(from.id);

        await from.save();
        await to.save();

        return res.json({ message: "Pedido aceito automaticamente" });
    }

    // já enviei pedido
    if (from.friends.send.includes(to.id)) {
        return res.status(400).json({ message: "Pedido já enviado" });
    }

    from.friends.send.push(to.id);
    to.friends.received.push(from.id);

    await from.save();
    await to.save();

    res.json({ message: "Pedido enviado" });
};

// Pedidos recebidos
exports.getReceivedOrders = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("friends.received", "name email avatar");

    res.json(user.friends.received);
};

// Pedidos enviados
exports.getSendOrders = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("friends.send", "name email avatar");

    res.json(user.friends.send);
};

// Aceitar pedido
exports.acceptOrder = async (req, res) => {
    const user = await User.findById(req.user.id);
    const from = await findUser(req.params.userId);

    if (!from) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!user.friends.received.includes(from.id)) {
        return res.status(400).json({ message: "Pedido não encontrado" });
    }

    user.friends.received.pull(from.id);
    from.friends.send.pull(user.id);

    user.friends.friends.push(from.id);
    from.friends.friends.push(user.id);

    await user.save();
    await from.save();

    res.json({ message: "Pedido aceito" });
};

// Rejeitar pedido
exports.rejectOrder = async (req, res) => {
    const user = await User.findById(req.user.id);
    const from = await findUser(req.params.userId);

    if (!from) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    user.friends.received.pull(from.id);
    from.friends.send.pull(user.id);

    await user.save();
    await from.save();

    res.json({ message: "Pedido rejeitado" });
};
