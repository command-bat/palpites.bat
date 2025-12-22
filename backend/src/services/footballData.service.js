const axios = require("axios");
const Match = require("../models/match.model");

const API_URL =
    "https://api.football-data.org/v4/competitions/BSA/matches";

async function syncMatches() {
    const response = await axios.get(API_URL, {
        headers: {
            "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
    });

    const matches = response.data.matches;

    for (const match of matches) {
        await Match.updateOne(
            { matchId: match.id },
            {
                matchId: match.id,

                competition: {
                    id: match.competition.id,
                    name: match.competition.name,
                    code: match.competition.code,
                },

                season: {
                    id: match.season.id,
                    startDate: match.season.startDate,
                    endDate: match.season.endDate,
                },

                utcDate: match.utcDate,
                status: match.status,

                homeTeam: {
                    id: match.homeTeam.id,
                    name: match.homeTeam.name,
                },

                awayTeam: {
                    id: match.awayTeam.id,
                    name: match.awayTeam.name,
                },

                score: {
                    winner: match.score.winner,
                },

                lastUpdated: match.lastUpdated,
            },
            { upsert: true }
        );
    }

    return matches.length;
}

module.exports = { syncMatches };
