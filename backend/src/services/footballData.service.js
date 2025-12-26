const axios = require("axios");
const Match = require("../models/match.model");
const Team = require("../models/team.model");

const headers = {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
};

const API_MATCHES_BY_SEASON = (season) =>
    `https://api.football-data.org/v4/competitions/BSA/matches?season=${season}`;

const API_TEAM = (id) => `https://api.football-data.org/v4/teams/${id}`;

/**
 * Sincroniza todas as partidas de uma temporada
 */
async function syncMatchesByYear(season) {
    const { data } = await axios.get(API_MATCHES_BY_SEASON(season), { headers });

    const teamIds = new Set();

    for (const match of data.matches) {
        teamIds.add(match.homeTeam.id);
        teamIds.add(match.awayTeam.id);

        // Salva/atualiza no Mongo
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

    // Sincroniza times
    await syncTeams([...teamIds]);

    console.log(`[FootballData] Synced ${data.matches.length} matches for season ${season}`);
    return data.matches.length;
}

/**
 * Sincroniza times que ainda não existem no banco
 */
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

module.exports = { syncMatchesByYear };
