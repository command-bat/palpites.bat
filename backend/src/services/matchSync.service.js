const cron = require("node-cron");
const Match = require("../models/match.model");
const { syncMatchesByYear } = require("./footballData.service");

const years = [2024, 2025, 2026, 2027]; // anos definidos
const competitions = ["WC", "CL", "BL1", "DED", "BSA", "PD", "FL1", "ELC", "PPL", "EC", "SA", "PL"];

// | WC  | FIFA World Cup
// | CL  | UEFA Champions League 
// | BL1 | Bundesliga 
// | DED | Eredivisie 
// | BSA | Campeonato Brasileiro Série A 
// | PD  | Primera Division 
// | FL1 | Ligue 1 
// | ELC | Championship 
// | PPL | Primeira Liga 
// | EC  | European Championship 
// | SA  | Serie A 
// | PL  | Premier League

const production = process.env.PRODUCTION === "true";

console.log("Está em produção?", production);

/**
 * Aguarda um tempo em ms
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executa o sync respeitando rate limit da API
 * - Se receber 429, aguarda 1 minuto e tenta novamente
 * - Se a API não tiver dados para o ano, apenas loga e continua
 */
async function syncWithRateLimit(competition, seasonYear) {
    while (true) {
        try {
            console.log(`[Sync] ${competition} - ${seasonYear}`);
            const result = await syncMatchesByYear(competition, seasonYear);

            if (!result || result.length === 0) {
                console.warn(`[Sync] Sem dados para ${competition} - ${seasonYear}. Continuando...`);
            }

            return; // sucesso → sai do loop
        } catch (err) {
            const status = err?.response?.status;

            if (status === 429) {
                console.warn(
                    `[RateLimit] Limite atingido (${competition} - ${seasonYear}). Aguardando 1 minuto...`
                );
                await sleep(60 * 1000);
            } else if (status === 400 || status === 404) {
                // Bad Request ou Not Found → apenas log, continuar
                console.warn(`[Sync] Dados não disponíveis para ${competition} - ${seasonYear}. Continuando...`);
                return;
            } else {
                // outros erros inesperados → log e continua
                console.error(`[Sync] Erro inesperado (${competition} - ${seasonYear}):`, err.message);
                return;
            }
        }
    }
}


/**
 * Sync ao iniciar a aplicação
 */
async function runStartupSync() {
    if (!production) {
        console.log("[Sync] Desativado, fora de Produção...");
        return;
    }

    console.log("[Sync] Running startup sync...");

    for (const seasonYear of years) {
        for (const competition of competitions) {
            await syncWithRateLimit(competition, seasonYear);
        }
    }

    console.log("[Sync] Startup sync completed");
}

/**
 * Sync diário às 20:00
 */
function scheduleDailySync() {
    if (!production) {
        console.log("[Sync] Desativado, fora de Produção...");
        return;
    }

    cron.schedule("0 20 * * *", async () => {
        console.log("[Sync] Running daily sync (20:00)");

        for (const seasonYear of years) {
            for (const competition of competitions) {
                await syncWithRateLimit(competition, seasonYear);
            }
        }

        console.log("[Sync] Daily sync completed");
    });

    console.log("[Sync] Daily sync scheduled for 20:00");
}

module.exports = {
    runStartupSync,
    scheduleDailySync,
};
