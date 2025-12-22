const Match = require("../models/match.model");

exports.getMatchById = async (req, res) => {
    const { id } = req.params;

    const match = await Match.findOne({ matchId: id });

    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }

    if (match.status !== "FINISHED") {
        return res.json({
            matchId: match.matchId,
            date: match.date,
            teams: {
                home: match.homeTeam,
                away: match.awayTeam,
            },
            status: "NOT_PLAYED",
        });
    }

    return res.json({
        matchId: match.matchId,
        date: match.date,
        teams: {
            home: match.homeTeam,
            away: match.awayTeam,
        },
        status: "FINISHED",
    });
};
