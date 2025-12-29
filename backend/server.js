require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const {
    runStartupSync,
    scheduleDailySync,
} = require("./src/services/matchSync.service");

const PORT = process.env.PORT;

(async () => {
    try {

        // 🔹 Sobe o servidor
        app.listen(PORT, () => {
            console.log(`[Server] Running on port ${PORT}`);
        });

        // 🔹 Conecta no MongoDB
        await connectDB();
        console.log("[DB] Connected");

        // 🔹 Sincroniza ao subir o backend (somente se vazio)
        await runStartupSync();

        // 🔹 Agenda sincronização diária às 20:00
        scheduleDailySync();

    } catch (err) {
        console.error("[Server] Failed to start:", err);
        process.exit(1);
    }
})();
