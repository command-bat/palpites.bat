const cron = require("node-cron");
const axios = require("axios");
const Match = require("../models/match.model");

async function syncMatches() {
    const { data } = await axios.get("https://api.football-data.org/v4/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
    });

    for (const m of data.matches) {
        await Match.updateOne(
            { matchId: m.id },
            {
                matchId: m.id,
                homeTeam: m.homeTeam.name,
                awayTeam: m.awayTeam.name,
                date: m.utcDate,
                status: m.status,
                competition: m.competition.name,
            },
            { upsert: true }
        );
    }
}

cron.schedule("0 20 * * *", syncMatches);

module.exports = syncMatches;
