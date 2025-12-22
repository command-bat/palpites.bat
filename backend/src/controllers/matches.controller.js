const Match = require("../models/match.model");

exports.getMatchById = async (req, res) => {
    const { id } = req.params;

    const match = await Match.findOne({ matchId: id });

    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }

    // Jogo ainda não ocorreu
    if (match.status !== "FINISHED") {
        return res.json({
            matchId: match.matchId,
            date: match.utcDate,
            teams: {
                home: match.homeTeam.name,
                away: match.awayTeam.name,
            },
            status: "NOT_PLAYED",
        });
    }

    // Jogo já ocorreu
    return res.json({
        matchId: match.matchId,
        date: match.utcDate,
        teams: {
            home: match.homeTeam.name,
            away: match.awayTeam.name,
        },
        winner: match.score.winner,
        status: "FINISHED",
    });
};
