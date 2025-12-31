const User = require("../models/user.model");
const Palpite = require("../models/palpite.model");
const mongoose = require("mongoose");


exports.getUserMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
}

exports.getUserId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            "email name avatar providers createdAt"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            providers: user.providers,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}


exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await Palpite.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

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
                $group: {
                    _id: null,
                    correct: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$match.status", "FINISHED"] },
                                        { $eq: ["$palpite", "$matchWinner"] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    wrong: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$match.status", "FINISHED"] },
                                        { $ne: ["$palpite", "$matchWinner"] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    pending: {
                        $sum: {
                            $cond: [
                                { $ne: ["$match.status", "FINISHED"] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        res.json(result[0] || { correct: 0, wrong: 0, pending: 0 });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
};
