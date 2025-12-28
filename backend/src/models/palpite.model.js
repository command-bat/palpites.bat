const mongoose = require("mongoose");

const PalpiteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        matchId: { type: Number, required: true },


        palpite: {
            type: String,
            enum: ["homeTeam", "tie", "awayTeam"],
            default: null,
        },

        lastPalpite: Date,

    },
    { timestamps: true }
);

// 🔒 1 palpite por usuário por partida
PalpiteSchema.index({ userId: 1, matchId: 1 }, { unique: true });

module.exports = mongoose.model("Palpite", PalpiteSchema);
