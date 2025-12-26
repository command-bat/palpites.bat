const cron = require("node-cron");
const Match = require("../models/match.model");
const { syncMatchesByYear } = require("./footballData.service");

const years = [2025/*, 2026*/]
const competitions = ["BSA", "ELC"]

//  | WC  | FIFA World Cup
//  | CL  | UEFA Champions League
//  | BL1 | Bundesliga
//  | DED | Eredivisie
//  | BSA | Campeonato Brasileiro Série A
//  | PD  | Primera Division
//  | FL1 | Ligue 1
//  | ELC | Championship
//  | PPL | Primeira Liga
//  | EC  | European Championship
//  | SA  | Serie A
//  | PL  | Premier League

const competition = {
    id: 2013,
    name: "Campeonato Brasileiro Série A",
    code: "BSA",
}

const seasonYear = 2025

const production = process.env.PRODUCTION === "true";

console.log("Está em produção?", production);

async function runStartupSync() {

    if (!production) {

        console.log("[Sync] Running startup sync...");
        try {
            for (const seasonYear of years) {
                for (const competition of competitions) {
                    console.log(competition, seasonYear)
                    await syncMatchesByYear(competition, seasonYear);
                }
            }
            console.log("[Sync] Startup sync completed");
        } catch (err) {
            console.error("[Sync] Startup sync failed:", err.message);
        }
    } else {
        console.log("[Sync] Desativado, fora de Produção...");
    }
}

function scheduleDailySync() {

    if (production) {

        cron.schedule("0 20 * * *", async () => {
            console.log("[Sync] Running daily sync (20:00)");
            try {
                await Promise.all(
                    years.map((seasonYear) =>
                        Promise.all(
                            competitions.map((competition) =>
                                syncMatchesByYear(competition, seasonYear)
                            )
                        )
                    )
                );
                console.log("[Sync] Daily sync completed");
            } catch (err) {
                console.error("[Sync] Daily sync error:", err.message);
            }
        });

        console.log("[Sync] Daily sync scheduled for 20:00");

    } else {
        console.log("[Sync] Desativado, fora de Produção...");
    }
}

module.exports = {
    runStartupSync,
    scheduleDailySync,
};
