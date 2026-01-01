const Palpite = require("../models/palpite.model");

exports.getRanking = async (req, res) => {
    try {
        const MIN_PALPITES = 0;
        const by = req.query.by === "errors" ? "errors" : "correct";

        const sortStage =
            by === "errors"
                ? {
                    errors: -1,
                    total: -1,
                    accuracy: 1,
                }
                : {
                    accuracy: -1,
                    total: -1,
                    correct: -1,
                };

        const pipeline = [
            {
                $lookup: {
                    from: "matches",
                    localField: "matchId",
                    foreignField: "matchId",
                    as: "match",
                },
            },
            { $unwind: "$match" },

            {
                $match: {
                    "match.status": "FINISHED",
                },
            },

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

            {
                $addFields: {
                    isCorrect: { $eq: ["$palpite", "$matchWinner"] },
                },
            },

            {
                $group: {
                    _id: "$userId",
                    correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                    errors: { $sum: { $cond: ["$isCorrect", 0, 1] } },
                },
            },

            {
                $addFields: {
                    total: { $add: ["$correct", "$errors"] },
                },
            },

            {
                $match: {
                    total: { $gte: MIN_PALPITES },
                },
            },

            {
                $addFields: {
                    accuracy: {
                        $multiply: [{ $divide: ["$correct", "$total"] }, 100],
                    },
                },
            },

            // 🔁 ORDENAÇÃO DINÂMICA
            {
                $sort: sortStage,
            },

            { $limit: 100 },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },

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
            metric: by,
            minPalpites: MIN_PALPITES,
            totalUsers: ranking.length,
            ranking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao gerar ranking" });
    }
};
