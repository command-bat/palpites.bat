const Palpite = require("../models/palpite.model");
const Match = require("../models/match.model");


exports.createPalpite = async (req, res) => {
    try {
        const { matchId, palpite } = req.body;
        const userId = req.user.id;

        if (!matchId || !palpite) {
            return res.status(400).json({ message: "matchId e palpite são obrigatórios" });
        }

        if (!["homeTeam", "tie", "awayTeam"].includes(palpite)) {
            return res.status(400).json({ message: "Palpite inválido" });
        }

        // 🔒 BLOQUEIO POR HORÁRIO
        const match = await Match.findOne({ matchId });

        if (!match) {
            return res.status(404).json({ message: "Partida não encontrada" });
        }

        console.log(new Date())
        if (new Date() >= match.utcDate - 60_000) {
            return res
                .status(400)
                .json({ message: "Palpite inválido: a partida já iniciou" });
        }

        // 🔄 cria ou atualiza palpite
        const result = await Palpite.findOneAndUpdate(
            { userId, matchId },
            {
                $set: {
                    palpite,
                    lastPalpite: new Date(),
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(200).json(result);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Palpite já existe" });
        }

        console.error(err);
        return res.status(500).json({ message: "Erro interno" });
    }
};

exports.getPalpiteByIdMatch = async (req, res) => {
    try {
        const matchId = Number(req.params.matchId);

        const result = await Palpite.aggregate([
            { $match: { matchId } },
            {
                $group: {
                    _id: "$palpite",
                    count: { $sum: 1 },
                },
            },
        ]);

        const response = {
            total: 0,
            homeTeam: 0,
            tie: 0,
            awayTeam: 0,
        };

        result.forEach(item => {
            response[item._id] = item.count;
            response.total += item.count;
        });

        return res.json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno" });
    }
};

exports.getPalpiteByIdUser = async (req, res) => {
    const userId = req.params.userId || req.user.id;
    try {
        const userId = req.params.userId || req.user.id;
        const { matchId, page = 1, limit = 20 } = req.query;

        const query = { userId };

        if (matchId) {
            query.matchId = Number(matchId);
        }

        // Se quiser apenas 1 palpite específico
        if (matchId) {
            const palpite = await Palpite.findOne(query);
            return res.json(palpite);
        }

        const skip = (page - 1) * limit;

        const [palpites, total] = await Promise.all([
            Palpite.find(query)
                .sort({ createdAt: -1 })
                .skip(Number(skip))
                .limit(Number(limit)),
            Palpite.countDocuments(query),
        ]);

        return res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit),
            data: palpites,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno" });
    }
};
