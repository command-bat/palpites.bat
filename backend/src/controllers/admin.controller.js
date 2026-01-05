const axios = require("axios");
const User = require("../models/user.model");
const mongoose = require("mongoose");


exports.isAdmin = async (req, res) => {

    res.json("É admin");
};


exports.fetch = async (req, res) => {
    try {
        const {
            url,
            method = "GET",
            params = {},
            body = {},
            headers = {},
        } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL é obrigatória" });
        }

        const parsedUrl = new URL(url);

        const finalHeaders = { ...headers };

        // só adiciona a API key se for football-data
        if (parsedUrl.origin === "https://api.football-data.org") {
            finalHeaders["X-Auth-Token"] = process.env.FOOTBALL_DATA_API_KEY;
        }

        const response = await axios({
            url,
            method,
            params,
            data: body,
            headers: finalHeaders,
        });

        return res.json(response.data);
    } catch (error) {
        console.error("[FETCH ERROR]", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            error: "Erro ao buscar dados da API",
            details: error.response?.data || null,
        });
    }
};

exports.getUserRaw = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.json(user);
    } catch (err) {
        console.error("[ADMIN GET USER RAW]", err);
        return res.status(500).json({ error: "Erro interno" });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const allowedFields = [
            "email",
            "name",
            "avatar",
            "role",
            "isPremium",
            "providers",
            "friends",
            "lastLoginAt",
        ];

        // filtra apenas campos permitidos
        const sanitizedUpdates = {};

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                sanitizedUpdates[key] = updates[key];
            }
        }

        // validações mínimas (admin-friendly)
        if (sanitizedUpdates.email && !sanitizedUpdates.email.includes("@")) {
            return res.status(400).json({ error: "Email inválido" });
        }

        if (
            sanitizedUpdates.role &&
            !["user", "admin"].includes(sanitizedUpdates.role)
        ) {
            return res.status(400).json({ error: "Role inválida" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            sanitizedUpdates,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.json({
            success: true,
            user,
        });
    } catch (err) {
        console.error("[ADMIN UPDATE USER]", err);
        return res.status(500).json({ error: "Erro interno" });
    }
};
