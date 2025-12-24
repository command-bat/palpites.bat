const axios = require("axios");
const Match = require("../models/match.model");
const Team = require("../models/team.model");

const API_MATCHES =
    "https://api.football-data.org/v4/competitions/BSA/matches";

const API_TEAM = (id) =>
    `https://api.football-data.org/v4/teams/${id}`;

const headers = {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
};

async function syncMatches() {
    const { data } = await axios.get(API_MATCHES, { headers });

    const teamIds = new Set();

    for (const match of data.matches) {
        teamIds.add(match.homeTeam.id);
        teamIds.add(match.awayTeam.id);

        await Match.updateOne(
            { matchId: match.id },
            {
                matchId: match.id,
                competition: match.competition,
                season: match.season,
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
                score: { winner: match.score?.winner },
                lastUpdated: match.lastUpdated,
            },
            { upsert: true }
        );
    }

    await syncTeams([...teamIds]);

    console.log(`[FootballData] Synced ${data.matches.length} matches`);
    return data.matches.length;
}

async function syncTeams(teamIds) {
    for (const id of teamIds) {
        const exists = await Team.findOne({ id });
        if (exists) continue;

        const { data } = await axios.get(API_TEAM(id), { headers });

        await Team.create({
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crest: data.crest,
        });

        console.log(`[Team] Saved ${data.name}`);
    }
}

module.exports = { syncMatches };
