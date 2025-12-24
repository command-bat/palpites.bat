const cron = require("node-cron");
const Match = require("../models/match.model");
const { syncMatches } = require("./footballData.service");

async function runStartupSync() {
    console.log("[Sync] Running startup sync...");
    try {
        await syncMatches();
        console.log("[Sync] Startup sync completed");
    } catch (err) {
        console.error("[Sync] Startup sync failed:", err.message);
    }
}

function scheduleDailySync() {
    cron.schedule("0 20 * * *", async () => {
        console.log("[Sync] Running daily sync (20:00)");
        try {
            await syncMatches();
            console.log("[Sync] Daily sync completed");
        } catch (err) {
            console.error("[Sync] Daily sync error:", err.message);
        }
    });

    console.log("[Sync] Daily sync scheduled for 20:00");
}

module.exports = {
    runStartupSync,
    scheduleDailySync,
};
