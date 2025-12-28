const axios = require("axios");
const Match = require("../models/match.model");
const Team = require("../models/team.model");

const headers = {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
};

const API_MATCHES_BY_SEASON = (competition, season) =>
    `https://api.football-data.org/v4/competitions/${competition}/matches?season=${season}`;

const API_TEAM = (id) => `https://api.football-data.org/v4/teams/${id}`;

/**
 * Sincroniza todas as partidas de uma temporada
 */
async function syncMatchesByYear(competition, season) {
    const { data } = await axios.get(API_MATCHES_BY_SEASON(competition, season), { headers });

    const teamIds = new Set();

    for (const match of data.matches) {
        teamIds.add(match.homeTeam.id);
        teamIds.add(match.awayTeam.id);

        await Match.updateOne(
            { matchId: match.id },
            {
                matchId: match.id,

                seasonYear: season,

                competition: {
                    id: match.competition.id,
                    name: match.competition.name,
                    code: match.competition.code,
                },

                season: match.season,
                utcDate: match.utcDate,
                status: match.status,
                stage: match.stage,


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

    console.log(
        `[FootballData] Synced ${data.matches.length} matches for season ${season} from the ${competition} competition`
    );

    return data.matches.length;
}

/**
 * Sincroniza times que ainda não existem no banco
 */
async function syncTeams(teamIds) {
    for (const id of teamIds) {
        const exists = await Team.findOne({ id });
        if (exists) continue;

        let success = false;

        while (!success) {
            try {
                const { data } = await axios.get(API_TEAM(id), { headers });

                await Team.create({
                    id: data.id,
                    name: data.name,
                    shortName: data.shortName,
                    tla: data.tla,
                    crest: data.crest,
                });

                console.log(`[Team] Saved ${data.name}`);
                success = true; // terminou com sucesso

            } catch (err) {
                const status = err?.response?.status;

                if (status === 429) {
                    console.warn(`[RateLimit] Limite atingido ao buscar time ${id}. Aguardando 1 minuto...`);
                    await sleep(60 * 1000); // espera 1 minuto
                } else if (status === 400 || status === 404) {
                    console.warn(`[Team] Time ${id} não encontrado. Continuando...`);
                    success = true; // ignora e segue para o próximo
                } else {
                    console.error(`[Team] Erro inesperado ao buscar time ${id}:`, err.message);
                    success = true; // ignora e segue para o próximo
                }
            }
        }
    }
}


module.exports = { syncMatchesByYear };
