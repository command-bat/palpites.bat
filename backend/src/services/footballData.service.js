const axios = require("axios");
const Match = require("../models/match.model");

const API_URL =
    "https://api.football-data.org/v4/competitions/BSA/matches";

async function syncMatches() {
    const { data } = await axios.get(API_URL, {
        headers: {
            "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
    });

    for (const match of data.matches) {
        await Match.updateOne(
            { matchId: match.id },
            {
                matchId: match.id,
                competition: match.competition,
                season: match.season,
                utcDate: match.utcDate,
                status: match.status,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                score: { winner: match.score?.winner },
                lastUpdated: match.lastUpdated,
            },
            { upsert: true }
        );
    }

    console.log(`[FootballData] Synced ${data.matches.length} matches`);
    return data.matches.length;
}

module.exports = { syncMatches };
