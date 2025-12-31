require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            serverSelectionTimeoutMS: 15000,
        });

        require("../models/palpite.model");
        require("../models/match.model");

        await mongoose.syncIndexes();

        console.log("✅ Indexes sincronizados com sucesso");
        process.exit(0);
    } catch (err) {
        console.error("❌ Erro ao sincronizar indexes", err);
        process.exit(1);
    }
})();
