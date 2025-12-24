const Match = require("../models/match.model");

/**
 * GET /matches
 * ?limit=10
 */
exports.getMatches = async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 0;

    const matches = await Match.find()
        .sort({ utcDate: -1 })
        .limit(limit);

    const response = matches.map((match) => ({
        matchId: match.matchId,
        awayTeam: match.awayTeam.name,
        homeTeam: match.homeTeam.name,
        competition: match.competition.name,
        startDate: match.utcDate,
        status: match.status,
    }));

    res.json(response);
};

/**
 * GET /matches/:id
 * Retorna o documento completo do banco
 */
exports.getMatchById = async (req, res) => {
    const match = await Match.findOne({ matchId: req.params.id });

    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }

    res.json(match);
};
