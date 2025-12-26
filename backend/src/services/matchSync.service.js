const cron = require("node-cron");
const Match = require("../models/match.model");
const { syncMatchesByYear } = require("./footballData.service");


const production = process.env.PRODUCTION === "true";

console.log("Está em produção?", production);

async function runStartupSync() {

    if (production) {

        console.log("[Sync] Running startup sync...");
        try {
            await syncMatchesByYear(2025);
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
                await syncMatchesByYear(2025);
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
