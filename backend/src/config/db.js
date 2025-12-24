const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("[MongoDB] Connected");
    } catch (err) {
        console.error("[MongoDB] Connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;