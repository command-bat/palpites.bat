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
                homeTeam: match.homeTeam?.name || "TBD",
                awayTeam: match.awayTeam?.name || "TBD",
                date: match.utcDate,
                status: match.status, // SCHEDULED | FINISHED | IN_PLAY
                competition: match.competition?.name || "Brasileirão Série A",
            },
            { upsert: true }
        );
    }

    console.log(`[FootballData] Synced ${matches.length} matches`);
    return matches.length;
}

module.exports = { syncMatches };
