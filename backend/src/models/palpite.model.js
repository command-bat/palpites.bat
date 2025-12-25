const mongoose = require("mongoose");

const PalpiteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        matchId: { type: Number, required: true },

        homeTeamId: { type: Number, required: true },
        awayTeamId: { type: Number, required: true },

        homeScore: { type: Number, required: true },
        awayScore: { type: Number, required: true },

        round: { type: Number }, // rodada
        season: { type: Number },

        points: { type: Number, default: 0 }, // calculado depois
        result: {
            type: String,
            enum: ["WIN", "DRAW", "LOSE", "PENDING"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

// 🔒 1 palpite por usuário por partida
PalpiteSchema.index({ userId: 1, matchId: 1 }, { unique: true });

module.exports = mongoose.model("Palpite", PalpiteSchema);
