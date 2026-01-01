const Palpite = require("../models/palpite.model");
const Match = require("../models/match.model");
const User = require("../models/user.model");

exports.getRanking = async (req, res) => {
    try {
        const MIN_PALPITES = 0; // 🔥 pode mudar depois (ex: 5 mensal)

        const pipeline = [
            // Junta palpite com partida
            {
                $lookup: {
                    from: "matches",
                    localField: "matchId",
                    foreignField: "matchId",
                    as: "match",
                },
            },
            { $unwind: "$match" },

            // Só partidas finalizadas
            {
                $match: {
                    "match.status": "FINISHED",
                },
            },

            // Normaliza vencedor
            {
                $addFields: {
                    matchWinner: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$match.score.winner", "HOME_TEAM"] }, then: "homeTeam" },
                                { case: { $eq: ["$match.score.winner", "AWAY_TEAM"] }, then: "awayTeam" },
                                { case: { $eq: ["$match.score.winner", "DRAW"] }, then: "tie" },
                            ],
                            default: null,
                        },
                    },
                },
            },

            // Define se acertou
            {
                $addFields: {
                    isCorrect: { $eq: ["$palpite", "$matchWinner"] },
                },
            },

            // Agrupa por usuário
            {
                $group: {
                    _id: "$userId",
                    correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                    errors: { $sum: { $cond: ["$isCorrect", 0, 1] } },
                },
            },

            // Total de palpites
            {
                $addFields: {
                    total: { $add: ["$correct", "$errors"] },
                },
            },

            // 🔒 Filtro mínimo de palpites
            {
                $match: {
                    total: { $gte: MIN_PALPITES },
                },
            },

            // Aproveitamento (%)
            {
                $addFields: {
                    accuracy: {
                        $multiply: [
                            { $divide: ["$correct", "$total"] },
                            100,
                        ],
                    },
                },
            },

            // 🏆 Ordenação FINAL (justa)
            {
                $sort: {
                    accuracy: -1, // principal
                    total: -1,    // desempate
                    correct: -1,  // opcional
                },
            },

            { $limit: 100 },

            // Junta dados do usuário
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },

            // Retorno final
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    avatar: "$user.avatar",
                    correct: 1,
                    errors: 1,
                    total: 1,
                    accuracy: { $round: ["$accuracy", 2] },
                },
            },
        ];

        const ranking = await Palpite.aggregate(pipeline);

        res.json({
            metric: "accuracy",
            minPalpites: MIN_PALPITES,
            totalUsers: ranking.length,
            ranking,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao gerar ranking" });
    }
};

