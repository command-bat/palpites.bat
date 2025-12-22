const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    matchId: { type: Number, unique: true, index: true },

    competition: {
        id: Number,
        name: String,
        code: String,
    },

    season: {
        id: Number,
        startDate: Date,
        endDate: Date,
    },

    utcDate: Date,
    status: String, // SCHEDULED | FINISHED

    homeTeam: {
        id: Number,
        name: String,
    },

    awayTeam: {
        id: Number,
        name: String,
    },

    score: {
        winner: String, // HOME_TEAM | AWAY_TEAM | DRAW | null
    },

    lastUpdated: Date,
});

module.exports = mongoose.model("Match", MatchSchema);
