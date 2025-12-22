require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const {
    initialSyncIfNeeded,
    scheduleDailySync,
} = require("./src/services/matchSync.service");

const PORT = process.env.PORT || 3000;

async function startServer() {
    // 1️⃣ Conectar no banco
    await connectDB();

    // 2️⃣ Sync inicial (se necessário)
    await initialSyncIfNeeded();

    // 3️⃣ Agendar sync diário
    scheduleDailySync();

    // 4️⃣ Subir servidor
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`[Server] Server started at port ${PORT}`);
    });
}

startServer().catch((err) => {
    console.error("[Server] Fatal startup error:", err);
    process.exit(1);
});
