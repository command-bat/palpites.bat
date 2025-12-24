const Match = require("../models/match.model");
const Team = require("../models/team.model");

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
 * GET /matches/:id?teams=true
 */
exports.getMatchById = async (req, res) => {
    const teams = req.query.teams === "true";

    const match = await Match.findOne({ matchId: req.params.id });

    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }

    // Se NÃO pedir teams, retorna direto
    if (!teams) {
        return res.json(match);
    }

    // Se pedir teams=true
    const homeTeam = await Team.findOne({ id: match.homeTeam.id });
    const awayTeam = await Team.findOne({ id: match.awayTeam.id });

    res.json({
        ...match.toObject(),
        homeTeam: homeTeam || match.homeTeam,
        awayTeam: awayTeam || match.awayTeam,
    });
};
