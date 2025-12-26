const Match = require("../models/match.model");
const Team = require("../models/team.model");

/**
 * GET /matches
 * ?limit=10
 * ?teams=true
 * ?season=2025
 * ?competition=BSA
 */
exports.getMatches = async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 0;
    const teams = (req.query.teams) || "true";
    const season = (req.query.season) || 2025;
    const competition = (req.query.competition) || "BSA";

    const matches = await Match.find({
        seasonYear: season,
        "competition.code": competition,
    })
        .sort({ utcDate: -1 })
        .limit(limit);

    // 🔹 Se NÃO quiser times detalhados
    if (!teams) {
        const response = matches.map((match) => ({
            seasonYear: match.season,
            competition: {
                id: match.competition.id,
                name: match.competition.name,
                code: match.competition.code,
            },
            matchId: match.matchId,
            awayTeam: match.awayTeam.name,
            homeTeam: match.homeTeam.name,
            competition: match.competition.name,
            startDate: match.utcDate,
            status: match.status,
        }));

        return res.json(response);
    }

    // 🔹 Se quiser times detalhados
    const response = await Promise.all(
        matches.map(async (match) => {
            const homeTeam = await Team.findOne({ id: match.homeTeam.id });
            const awayTeam = await Team.findOne({ id: match.awayTeam.id });

            return {
                matchId: match.matchId,
                competition: match.competition,
                season: match.season,
                utcDate: match.utcDate,
                status: match.status,
                score: match.score,
                homeTeam: homeTeam || match.homeTeam,
                awayTeam: awayTeam || match.awayTeam,
            };
        })
    );

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
