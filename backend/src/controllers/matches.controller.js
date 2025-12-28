const Match = require("../models/match.model");
const Team = require("../models/team.model");
const jwt = require("jsonwebtoken");
const Palpite = require("../models/palpite.model");

/**
 * GET /matches
 * ?limit=10
 * ?teams=true
 * ?season=2025
 * ?competition=BSA
 * ?date=2026-01-28
 * ?palpite=true
 */
exports.getMatches = async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 0;
    const teams = req.query.teams === "true";
    const season = (req.query.season) || 2025;
    const competition = (req.query.competition) || "BSA";
    const date = (req.query.date);
    const palpite = (req.query.palpite === "true") || false;
    const token = req.cookies.auth_token;

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    let userId = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            userId = decoded.id || decoded._id;
        } catch (e) {
            userId = null;
        }
    }

    const matches = await Match.find({
        seasonYear: season,
        "competition.code": competition,

        // filtro importante
        "homeTeam.id": { $ne: null },
        "awayTeam.id": { $ne: null },

        utcDate: {
            $gte: startDate,
            $lte: endDate
        },
    })
        .sort({ utcDate: -1 })
        .limit(limit);

    let filteredMatches = matches;
    let palpitesMap = new Map();

    if (userId) {
        const matchIds = matches.map(m => m.matchId);

        const palpites = await Palpite.find({
            userId,
            matchId: { $in: matchIds }
        }).select("matchId palpite");

        palpitesMap = new Map(
            palpites.map(p => [
                p.matchId,
                p.palpite
            ])
        );

        if (!palpite) {
            filteredMatches = matches.filter(
                m => !palpitesMap.has(m.matchId)
            );
        }
    }

    //  times NÃO detalhados
    if (!teams) {
        const response = filteredMatches.map((match) => ({
            seasonYear: match.season,
            competition: {
                id: match.competition.id,
                name: match.competition.name,
                code: match.competition.code,
            },
            matchId: match.matchId,
            awayTeam: match.awayTeam.name,
            homeTeam: match.homeTeam.name,
            competition: match.competition.name,
            startDate: match.utcDate,
            status: match.status,
            stage: match.stage,

            hasPalpite: palpitesMap.has(match.matchId),
            userPalpite: palpitesMap.get(match.matchId) || null,
        }));

        return res.json(response);
    }

    //  times detalhados
    const response = await Promise.all(
        filteredMatches.map(async (match) => {
            const homeTeam = await Team.findOne({ id: match.homeTeam.id });
            const awayTeam = await Team.findOne({ id: match.awayTeam.id });

            return {
                matchId: match.matchId,
                competition: match.competition,
                season: match.season,
                utcDate: match.utcDate,
                status: match.status,
                score: match.score,
                homeTeam: homeTeam || match.homeTeam,
                awayTeam: awayTeam || match.awayTeam,
                stage: match.stage,

                hasPalpite: palpitesMap.has(match.matchId),
                userPalpite: palpitesMap.get(match.matchId) || null,

            };
        })
    );

    res.json(response);
};

/**
 * GET /matches/:id
 * ?teams=true
 */
exports.getMatchById = async (req, res) => {
    const teams = req.query.teams === "true";

    const match = await Match.findOne({ matchId: req.params.id });

    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }

    // Se NÃO pedir teams, retorna direto
    if (!teams) {
        return res.json(match);
    }

    // Se pedir teams=true
    const homeTeam = await Team.findOne({ id: match.homeTeam.id });
    const awayTeam = await Team.findOne({ id: match.awayTeam.id });

    res.json({
        ...match.toObject(),
        homeTeam: homeTeam || match.homeTeam,
        awayTeam: awayTeam || match.awayTeam,
    });
};


/**
 * GET /matches/days
 * ?season=2026
 * ?competition=BSA
 */
exports.getMatchDays = async (req, res) => {
    try {
        // Desativa cache
        res.set("Cache-Control", "no-store");

        const season = Number(req.query.season) || 2025;
        const competition = req.query.competition || "BSA";
        const all = req.query.all === "true"; // transforma em boolean

        // Se all=true, verifica se o usuário é premium
        if (all) {
            if (!req.user?.isPremium) {
                return res.status(403).json({ error: "Apenas usuários premium podem acessar todo o histórico" });
            }

            // Retorna todos os dias com jogos
            const days = await Match.aggregate([
                {
                    $match: {
                        seasonYear: season,
                        "competition.code": competition,
                        "homeTeam.id": { $ne: null },
                        "awayTeam.id": { $ne: null },
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$utcDate"
                            }
                        }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            return res.json(days.map(d => d._id));
        }

        // Caso all=false ou ausente, pega os próximos 7 dias
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);

        let days = await Match.aggregate([
            {
                $match: {
                    seasonYear: season,
                    "competition.code": competition,
                    "homeTeam.id": { $ne: null },
                    "awayTeam.id": { $ne: null },
                    utcDate: { $gte: today, $lte: sevenDaysLater }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$utcDate"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Se não houver jogos nos próximos 7 dias, pega o próximo dia que tiver algum jogo
        if (!days.length) {
            const nextDay = await Match.aggregate([
                {
                    $match: {
                        seasonYear: season,
                        "competition.code": competition,
                        "homeTeam.id": { $ne: null },
                        "awayTeam.id": { $ne: null },
                        utcDate: { $gte: today }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$utcDate"
                            }
                        }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 1 }
            ]);

            days = nextDay;
        }

        res.json(days.map(d => d._id));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar dias com jogos" });
    }
};

