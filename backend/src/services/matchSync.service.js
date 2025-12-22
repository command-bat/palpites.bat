const cron = require("node-cron");
const Match = require("../models/match.model");
const { syncMatches } = require("./footballData.service");

async function initialSyncIfNeeded() {
    const count = await Match.countDocuments();

    if (count === 0) {
        console.log("[Sync] No matches found. Running first sync...");
        await syncMatches();
        console.log("[Sync] Initial sync completed");
    } else {
        console.log(`[Sync] ${count} matches already stored. Skipping initial sync`);
    }
}

function scheduleDailySync() {
    // Todo dia às 20:00 (horário do servidor)
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
    initialSyncIfNeeded,
    scheduleDailySync,
};
