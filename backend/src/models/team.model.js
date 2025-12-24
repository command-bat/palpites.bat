const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, index: true },
        name: String,
        shortName: String,
        tla: String,
        crest: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
